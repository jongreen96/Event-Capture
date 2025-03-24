import { randomUUIDv7, sql } from 'bun';
import { Hono } from 'hono';
import { validator } from 'hono/validator';

export const planRoute = new Hono<{
  Variables: { user: any };
}>();

planRoute.get('/', async (c) => {
  try {
    const plans = await sql`SELECT * FROM plan WHERE userid = ${
      c.get('user').id
    }`;
    return c.json(plans);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'An error occurred while fetching plans.' }, 500);
  }
});

planRoute.post(
  '/',
  validator('json', (value, c) => {
    if (
      typeof value.plan !== 'string' ||
      !['trial', 'small', 'medium', 'large'].includes(value.plan.toLowerCase())
    ) {
      return c.json(
        {
          error:
            'Invalid plan type. Must be one of: trial, small, medium, large',
        },
        400
      );
    }

    return {
      plan: value.plan,
    };
  }),
  async (c) => {
    const { plan } = c.req.valid('json');

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
        const trials = await sql`SELECT * FROM plan WHERE userid = ${
          c.get('user').id
        } AND plan = 'trial'`;
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
  }
);
