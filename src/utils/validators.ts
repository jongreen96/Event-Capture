export const createPlanValidation = (value: any, c: any) => {
  if (
    typeof value.plan !== 'string' ||
    !['trial', 'small', 'medium', 'large'].includes(value.plan.toLowerCase())
  ) {
    return c.json(
      {
        error: 'Invalid plan type. Must be one of: trial, small, medium, large',
      },
      400
    );
  }

  return {
    plan: value.plan,
  };
};

export const updatePlanValidation = (val: any, c: any) => {
  const validKeys = ['pin', 'eventname', 'pauseduploads', 'status', 'url'];
  const validStatus = ['canceled', 'active', 'paused'];

  if (typeof val !== 'object' || val === null) {
    return c.json({ error: 'Invalid input. Must be a JSON object.' }, 400);
  }

  const keys = Object.keys(val);

  if (!keys.includes('planId')) {
    return c.json({ error: 'Missing required key: planId' }, 400);
  }

  if (typeof val.planId !== 'string' || !val.planId.trim()) {
    return c.json({ error: 'planId must be a non-empty string' }, 400);
  }

  const otherKeys = keys.filter((key) => key !== 'planId');

  if (otherKeys.length !== 1) {
    return c.json(
      { error: 'Exactly one additional key (besides planId) is allowed.' },
      400
    );
  }

  const key = otherKeys[0];
  const value = val[key];

  if (!validKeys.includes(key)) {
    return c.json(
      { error: `Invalid key. Must be one of: ${validKeys.join(', ')}` },
      400
    );
  }

  switch (key) {
    case 'pin':
      if (!/^\d{4}$/.test(String(value)) && value !== null) {
        return c.json(
          { error: 'Pin must be exactly 4 digits and contain digits only' },
          400
        );
      }
      break;
    case 'eventname':
      if (typeof value !== 'string') {
        return c.json({ error: 'Event name must be a string' }, 400);
      }
      break;
    case 'pauseduploads':
      if (typeof value !== 'boolean') {
        return c.json({ error: 'Paused uploads must be a boolean' }, 400);
      }
      break;
    case 'status':
      if (!validStatus.includes(String(value))) {
        return c.json(
          { error: `Status must be one of: ${validStatus.join(', ')}` },
          400
        );
      }
      break;
    case 'url':
      if (typeof value !== 'boolean') {
        return c.json({ error: 'URL must be a boolean' }, 400);
      }
      break;
  }

  return { planId: val.planId, key, value };
};

export const planIdValidation = (val: any, c: any) => {
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  if (typeof val.planId !== 'string' || !uuidRegex.test(val.planId)) {
    return c.json({ error: 'planId must be a valid UUID string' }, 400);
  }

  return { planId: val.planId };
};
