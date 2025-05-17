import { randomUUIDv7 } from 'bun';
import { Pool } from 'pg';
import { planSizes } from '../../client/src/routes/_authenticated/plans';

const db = new Pool({ connectionString: process.env.DATABASE_URL });

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

export async function checkStorageCapacity(uploadSize: number, planId: string) {
  const plan = await db.query(
    `
    SELECT plan
    FROM plan
    WHERE id = $1
    `,
    [planId]
  );

  if (plan.rowCount === 0) return false;

  const allImages = await db.query(
    `
    SELECT imagesize
    FROM images
    WHERE planid = $1
    `,
    [planId]
  );

  const totalSizeBytes =
    allImages.rows.reduce((acc, curr) => acc + curr.imagesize, 0) * 1024;
  const planKey = plan.rows[0].plan as keyof typeof planSizes;
  const planStorageBytes = planSizes[planKey].storage * 1024 * 1024;

  return totalSizeBytes + uploadSize <= planStorageBytes;
}

export async function isPaused(planId: string) {
  const res = await db.query(
    `
    SELECT pauseduploads
    FROM plan
    WHERE id = $1
    `,
    [planId]
  );

  if (res.rowCount === 0) return null;

  return res.rows[0].pauseduploads;
}

export async function isAuthorized(pin: string, planId: string) {
  const res = await db.query(
    `
    SELECT pin
    FROM plan
    WHERE id = $1
    `,
    [planId]
  );

  if (res.rowCount === 0) return false;

  return res.rows[0].pin === pin;
}
