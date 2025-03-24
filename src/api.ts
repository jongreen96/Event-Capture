import { randomUUIDv7, sql } from 'bun';
import { Hono } from 'hono';
import { auth } from './utils/auth';

const apiRoute = new Hono<{
  Variables: {
    user: any;
    session: any;
  };
}>();

apiRoute.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

apiRoute.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.notFound();

  c.set('user', session.user);
  return next();
});

apiRoute.get('/test', (c) => c.json(c.get('user')));

apiRoute.post('/plan/create/:plan', async (c) => {
  const plan = c.req.param('plan');

  const planObject = {
    id: randomUUIDv7(),
    userid: c.get('user').id,
    plan: plan.toLowerCase(),
    eventname: 'Test Plan',
    pauseduploads: false,
    url: 'test',
    pin: null,
    status: plan !== 'trial' ? 'active' : 'canceled',
    startdate: new Date().toISOString(),
    enddate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextbillingdate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  try {
    if (plan === 'trial') {
      const trials =
        await sql`SELECT * FROM plan WHERE userid = ${c.get('user').id} AND plan = 'trial'`;
      if (trials.length > 0)
        return c.json(
          { error: 'Only one trial plan is allowed per user.' },
          403
        );
    }
    const res = await sql`INSERT INTO plan ${sql(planObject)} RETURNING id`;
    if (res.length > 0) return c.json({ id: res[0].id }, 201);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Database error occurred. Please retry.' }, 500);
  }
});

apiRoute.get('*', (c) => c.notFound());

export default apiRoute;
