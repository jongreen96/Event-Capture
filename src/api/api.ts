import { Hono } from 'hono';
import { auth } from '../utils/auth';
import { planRoute } from './plan';
import { uploadRoute } from './upload';

const apiRoute = new Hono<{
  Variables: { user: any };
}>();

apiRoute.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

apiRoute.route('/upload', uploadRoute);

apiRoute.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.notFound();

  c.set('user', session.user);
  return next();
});

apiRoute.get('/test', (c) => c.json(c.get('user')));

apiRoute.route('/plan', planRoute);

apiRoute.get('*', (c) => c.notFound());

export default apiRoute;
