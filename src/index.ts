import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/api/test', (c) => {
  return c.text('This is a test endpoint!');
});

export default app;
