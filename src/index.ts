import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

app.get('/api/test', (c) => {
  return c.text('This is a test endpoint!');
});

app.get('*', serveStatic({ root: './src/dist' }));
app.get('*', serveStatic({ path: './src/dist/index.html' }));

export default app;
