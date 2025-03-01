import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import imageRoute from './routes/images';

const app = new Hono();

app.use(logger());

app.route('/api/images', imageRoute);

app.get('*', serveStatic({ root: './server/public' }));
app.get('*', serveStatic({ path: './server/public/index.html' }));

export default app;
