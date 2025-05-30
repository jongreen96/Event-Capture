import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { deleteImage, R2 } from '../utils/db';

export const photosRoute = new Hono<{
  Variables: { user: any };
}>();

photosRoute.delete(
  '/',
  validator('json', (val) => {
    if (
      !val ||
      !Array.isArray(val.photoId) ||
      val.photoId.some((id: unknown) => typeof id !== 'string')
    ) {
      return {
        error: 'Invalid request body',
      };
    }

    return {
      photoIdArr: val.photoId,
    };
  }),
  async (c) => {
    const { photoIdArr } = c.req.valid('json') as { photoIdArr: string[] };
    const userId = c.get('user').id;

    try {
      for (const photoId of photoIdArr) {
        const deletedImage = await deleteImage({
          userId,
          photoId,
        });

        if (!deletedImage)
          return c.json(
            { error: `Photo with ID ${photoId} not found or already deleted.` },
            404
          );

        R2.delete(deletedImage);
        R2.delete(`${deletedImage}-preview`);
      }
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
