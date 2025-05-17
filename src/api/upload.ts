import { S3Client } from 'bun';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import {
  checkStorageCapacity,
  getUploadData,
  isAuthorized,
  isPaused,
} from '../utils/db';

export const uploadRoute = new Hono<{
  Variables: { user: any };
}>();

uploadRoute.get(
  '/:url',
  validator('param', (val) => {
    if (typeof val.url !== 'string' || !/^[\s\S]{10}$/.test(val.url)) {
      return {
        error: 'URL must be a non-empty string of exactly 10 characters',
      };
    }

    return { url: val.url };
  }),
  async (c) => {
    const { url } = c.req.valid('param');

    try {
      const plan = await getUploadData(String(url));
      if (!plan) return c.json({ error: 'Plan not found' }, 404);

      return c.json(plan);
    } catch (e) {
      console.error(e);
      return c.json({ error: 'An error occurred while fetching plan.' }, 500);
    }
  }
);

uploadRoute.post(
  '/:planId/check-storage',
  validator('param', (val) => {
    if (typeof val.planId !== 'string')
      return { error: 'Plan ID must be a non-empty string' };

    return { planId: val.planId };
  }),
  validator('json', (val) => {
    if (typeof val.uploadSize !== 'number' || val.uploadSize <= 0)
      return { error: 'Upload size must be a positive number' };

    return { uploadSize: val.uploadSize };
  }),
  async (c) => {
    try {
      const hasSpace = await checkStorageCapacity(
        c.req.valid('json').uploadSize,
        String(c.req.valid('param').planId)
      );
      if (!hasSpace)
        return c.json(
          { error: 'Storage limit exceeded, please contact the host' },
          403
        );

      return c.json({ success: true });
    } catch (e) {
      console.error(e);
      return c.json(
        { error: 'An error occurred while checking storage.' },
        500
      );
    }
  }
);

const r2 = new S3Client({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
});

uploadRoute.post(
  ':planId/presign',
  validator('param', (val) => {
    if (typeof val.planId !== 'string')
      return { error: 'Plan ID must be a non-empty string' };

    return { planId: val.planId };
  }),
  validator('json', (val) => {
    if (!Array.isArray(val.fileMetadata))
      return { error: 'File metadata must be an array' };

    for (const file of val.fileMetadata) {
      if (typeof file.name !== 'string' || typeof file.type !== 'string')
        return { error: 'Invalid file metadata' };
    }

    if (val.pin && typeof val.pin !== 'string')
      return { error: 'Pin must be a string' };

    return { fileMetadata: val.fileMetadata, pin: val.pin };
  }),
  async (c) => {
    try {
      const { planId } = c.req.valid('param') as { planId: string };
      const { fileMetadata } = c.req.valid('json') as {
        fileMetadata: { name: string; type: string }[];
      };

      const paused = await isPaused(planId);
      if (paused) return c.json({ error: 'Uploads are paused' }, 403);

      const authorized = await isAuthorized(c.req.valid('json').pin, planId);
      if (!authorized) return c.json({ error: 'Invalid pin' }, 401);

      const presignedUrls = await Promise.all(
        fileMetadata.map(async (file) => {
          const url = r2.presign(file.name, {
            expiresIn: 3600, // 1 hour
            method: 'PUT',
            type: file.type,
          });
          return {
            url,
            key: file.name,
          };
        })
      );

      return c.json(presignedUrls);
    } catch (e) {
      console.error(e);
      return c.json({ error: 'An error occurred while presigning URLs.' }, 500);
    }
  }
);
