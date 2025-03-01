import { Hono } from 'hono';
import { logger } from 'hono/logger';
import imageRoute from './routes/images';

const app = new Hono();

app.use(logger());

app.route('/api/images', imageRoute);

export default app;
