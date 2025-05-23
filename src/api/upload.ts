import { Hono } from 'hono';
import { validator } from 'hono/validator';
import {
  addImage,
  checkUploadPermissions,
  getUploadData,
  R2,
} from '../utils/db';
import { planIdValidation } from '../utils/validators';

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
  ':planId/presign',
  validator('param', planIdValidation),
  validator('json', (val) => {
    if (!Array.isArray(val.fileMetadata))
      return { error: 'File metadata must be an array' };

    for (const file of val.fileMetadata) {
      if (
        typeof file.name !== 'string' ||
        typeof file.type !== 'string' ||
        file.size <= 0
      )
        return { error: 'Invalid file metadata' };
    }

    if (val.pin && typeof val.pin !== 'string')
      return { error: 'Pin must be a string' };

    return { fileMetadata: val.fileMetadata, pin: val.pin };
  }),
  async (c) => {
    try {
      const { planId } = c.req.valid('param') as { planId: string };
      const { fileMetadata, pin } = c.req.valid('json') as {
        fileMetadata: { name: string; type: string; size: number }[];
        pin?: string;
      };

      if (fileMetadata.length === 0)
        return c.json({ error: 'No files provided' }, 400);

      const uploadPermissions = await checkUploadPermissions({
        uploadSize: fileMetadata.reduce((acc, file) => acc + file.size, 0),
        planId,
        pin: c.req.valid('json').pin,
      });

      if (!uploadPermissions.exists)
        return c.json({ error: 'Plan not found' }, 404);
      if (uploadPermissions.paused)
        return c.json({ error: 'Uploads are paused' }, 403);
      if (!uploadPermissions.authorized)
        return c.json({ error: 'Invalid pin' }, 401);
      if (!uploadPermissions.hasSpace)
        return c.json({ error: 'Storage limit exceeded' }, 409);

      const presignedUrls = await Promise.all(
        fileMetadata.map(async (file) => {
          const url = R2.presign(file.name, {
            expiresIn: 3600, // 1 hour
            method: 'PUT',
            type: file.type,
          });

          const thumbUrl = R2.presign(`${file.name}-preview`, {
            expiresIn: 3600, // 1 hour
            method: 'PUT',
            type: file.type,
          });

          return {
            url,
            thumbUrl,
            fileName: file.name,
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

uploadRoute.post(
  '/:planId/add-image',
  validator('param', planIdValidation),
  validator('json', (val) => {
    if (typeof val.guest !== 'string')
      return { error: 'Guest name must be a string' };
    if (typeof val.size !== 'number' || val.size <= 0)
      return { error: 'Invalid image size' };
    if (typeof val.imagename !== 'string')
      return { error: 'Image name must be a string' };

    return {
      guest: val.guest,
      size: val.size,
      imagename: val.imagename,
    };
  }),
  async (c) => {
    const { planId } = c.req.valid('param') as { planId: string };
    const { guest, size, imagename } = c.req.valid('json') as {
      guest: string;
      size: number;
      imagename: string;
    };

    try {
      await addImage({
        planId,
        guest: guest
          .split(' ')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        size,
        imagename,
      });

      return c.json({ message: 'Image added successfully' }, 200);
    } catch (e) {
      console.error(e);
      return c.json({ error: 'An error occurred while adding image.' }, 500);
    }
  }
);
