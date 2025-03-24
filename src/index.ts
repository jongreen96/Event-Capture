import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import apiRoute from './api/api';

const app = new Hono();

app.use('*', logger());

app.route('/api', apiRoute);

app.get('*', serveStatic({ root: './src/dist' }));
app.get('*', serveStatic({ path: './src/dist/index.html' }));

export default app;
