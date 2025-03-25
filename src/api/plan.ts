import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { nanoid } from 'nanoid';
import { createPlan, getPlans, updatePlan } from '../utils/db';
import {
  createPlanValidation,
  updatePlanValidation,
} from '../utils/validators';

export const planRoute = new Hono<{
  Variables: { user: any };
}>();

planRoute.get('/', async (c) => {
  try {
    const plans = await getPlans(c.get('user').id);
    return c.json(plans);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'An error occurred while fetching plans.' }, 500);
  }
});

planRoute.post(
  '/',
  validator('json', (val, c) => createPlanValidation(val, c)),
  async (c) => {
    const { plan } = c.req.valid('json');

    try {
      const newPlanId = await createPlan({
        userId: c.get('user').id,
        plan,
        url: nanoid(10),
      });

      return c.json({ id: newPlanId }, 201);
    } catch (e) {
      console.error(e);
      const message =
        e instanceof Error ? e.message : 'An unknown error occurred';
      return c.json({ error: message }, 500);
    }
  }
);

planRoute.put(
  '/',
  validator('json', (val, c) => updatePlanValidation(val, c)),
  async (c) => {
    let { key, value, planId } = c.req.valid('json');

    if (key === 'url') value = nanoid(10);

    try {
      await updatePlan({
        userId: c.get('user').id,
        planId,
        key,
        value,
      });

      return c.json({ success: true });
    } catch (e) {
      console.error(e);
      const message =
        e instanceof Error ? e.message : 'An unknown error occurred';
      return c.json({ error: message }, 400);
    }
  }
);
