import { Hono } from 'hono';

export const testRoute = new Hono();

testRoute.get('/', (c) => {
  return c.json({ message: 'Test route working!' });
});
