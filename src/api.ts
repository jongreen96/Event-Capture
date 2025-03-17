import { Hono } from 'hono';
import { auth } from './utils/auth';

const apiRoute = new Hono();

console.log('GERE');

apiRoute.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

apiRoute.get('/test', (c) => {
  return c.text('This is a test endpoint!');
});

export default apiRoute;
