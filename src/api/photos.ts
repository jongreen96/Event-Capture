import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { deleteImage, R2 } from '../utils/db';

export const photosRoute = new Hono<{
  Variables: { user: any };
}>();

photosRoute.delete(
  '/:photoId',
  validator('param', (val) => {
    if (typeof val.photoId !== 'string' || val.photoId.length === 0) {
      return {
        error: 'Photo ID must be a non-empty string',
      };
    }

    return { photoId: val.photoId };
  }),
  async (c) => {
    const { photoId } = c.req.valid('param') as { photoId: string };
    const userId = c.get('user').id;

    try {
      const deletedImage = await deleteImage({
        userId,
        photoId,
      });

      R2.delete(deletedImage);
      R2.delete(`${deletedImage}-preview`);
    } catch (e) {
      console.error(e);
      return c.json(
        { error: 'An error occurred while deleting the photo.' },
        500
      );
    }

    return c.json({ success: true });
  }
);
