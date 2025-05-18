import { randomUUIDv7, S3Client } from 'bun';
import { Pool } from 'pg';
import { planSizes } from '../../client/src/routes/_authenticated/plans';

const db = new Pool({ connectionString: process.env.DATABASE_URL });

export const R2 = new S3Client({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
});

export async function getPlans(userId: string) {
  const plans = await db.query(
    `
    SELECT id, plan, eventname, pauseduploads, url, pin, status, enddate, nextbillingdate, createdat
    FROM plan
    WHERE userid = $1
    ORDER BY createdat DESC
    `,
    [userId]
  );

  if (plans.rows.length === 0) return [];

  const planIds = plans.rows.map((plan) => plan.id);

  const images = await db.query(
    `
    SELECT * FROM images
    WHERE planid = ANY($1)
    ORDER BY createdat DESC
    `,
    [planIds]
  );

  const planMap = new Map(
    plans.rows.map((plan) => [plan.id, { ...plan, images: [], guests: [] }])
  );

  for (const image of images.rows) {
    const plan = planMap.get(image.planid);
    if (plan) {
      plan.images.push(image);
      if (image.guestname) {
        const guestSet = new Set(plan.guests);
        guestSet.add(image.guestname);
        plan.guests = Array.from(guestSet);
      }
    }
  }

  return Array.from(planMap.values());
}

export async function createPlan({
  userId,
  plan,
  url,
}: {
  userId: string;
  plan: 'trial' | 'small' | 'medium' | 'large';
  url: string;
}) {
  if (plan === 'trial') {
    const trials = await db.query(
      `
      SELECT *
      FROM plan
      WHERE userid = $1
      AND plan = $2`,
      [userId, 'trial']
    );

    if (trials.rows.length > 0)
      throw new Error('Only one trial plan is allowed per user.');
  }

  const id = await db.query(
    `
    INSERT INTO plan (id, userid, plan, eventname, pauseduploads, url, pin, status, enddate, nextbillingdate)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id
    `,
    [
      randomUUIDv7(),
      userId,
      plan,
      'Test Plan',
      false,
      url,
      null,
      plan !== 'trial' ? 'active' : 'canceled',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ]
  );
  return id.rows[0].id;
}

export async function updatePlan({
  userId,
  planId,
  key,
  value,
}: {
  userId: string;
  planId: string;
  key: string;
  value: any;
}) {
  const res = await db.query(
    `
    UPDATE plan
    SET ${key} = $1, updatedat = NOW()
    WHERE id = $2
    AND userid = $3
    RETURNING id
    `,
    [value, planId, userId]
  );

  if (res.rowCount === 0) throw new Error('No plan found');

  return res.rows[0];
}

export async function getUploadData(url: string) {
  const res = await db.query(
    `
    SELECT id, eventname, pauseduploads, pin
    FROM plan
    WHERE url = $1 AND status = 'active'
    `,
    [url]
  );

  if (res.rowCount === 0) return null;

  return {
    planId: res.rows[0].id,
    eventname: res.rows[0].eventname,
    pauseduploads: res.rows[0].pauseduploads,
    hasPin: !!res.rows[0].pin,
  };
}

export async function checkUploadPermissions({
  uploadSize,
  planId,
  pin,
}: {
  uploadSize: number;
  planId: string;
  pin?: string;
}) {
  // Query plan and all images in one go
  const planAndImages = await db.query(
    `
    SELECT
      p.plan,
      p.pauseduploads,
      p.pin,
      COALESCE(SUM(i.imagesize), 0) AS total_imagesize
    FROM plan p
    LEFT JOIN images i ON i.planid = p.id
    WHERE p.id = $1
    GROUP BY p.plan, p.pauseduploads, p.pin
    `,
    [planId]
  );

  if (planAndImages.rowCount === 0) {
    return { exists: false };
  }

  const row = planAndImages.rows[0];
  const planKey = row.plan as keyof typeof planSizes;
  const planStorageBytes = planSizes[planKey].storage * 1024 * 1024;
  // imagesize is stored in KB, so convert to bytes
  const totalSizeBytes = Number(row.total_imagesize) * 1024;

  const paused = row.pauseduploads;
  const hasPin = !!row.pin;
  const authorized = !hasPin || (pin && row.pin === pin);
  const hasSpace = totalSizeBytes + uploadSize <= planStorageBytes;

  return {
    exists: true,
    paused,
    hasPin,
    authorized,
    hasSpace,
  };
}
