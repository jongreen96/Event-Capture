import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const imageSchema = z.object({
  id: z.number().int().positive().min(1),
  url: z.string().url(),
  name: z.string(),
});
const createImageSchema = imageSchema.omit({ id: true });
export type Image = z.infer<typeof imageSchema>;

const fakeImages: Image[] = [
  { id: 1, url: 'https://example.com/image1.jpg', name: 'Image 1' },
  { id: 2, url: 'https://example.com/image2.jpg', name: 'Image 2' },
  { id: 3, url: 'https://example.com/image3.jpg', name: 'Image 3' },
];

const imageRoute = new Hono()
  .get('/', (c) => c.json({ images: fakeImages }))

  .get('/:id{[0-9]+}', (c) => {
    const imageId = Number(c.req.param('id'));
    const image = fakeImages.find((img) => img.id === imageId);

    return image ? c.json({ image }) : c.notFound();
  })

  .post('/', zValidator('json', createImageSchema), async (c) => {
    const newImage = c.req.valid('json');

    fakeImages.push({ ...newImage, id: fakeImages.length + 1 });

    c.status(201);
    return c.json({ image: newImage });
  })

  .delete('/:id{[0-9]+}', (c) => {
    const imageId = Number(c.req.param('id'));
    const imageIndex = fakeImages.findIndex((img) => img.id === imageId);
    if (imageIndex === -1) return c.notFound();

    const deletedImage = fakeImages.splice(imageIndex, 1);

    return c.json({ image: deletedImage });
  });

export default imageRoute;
