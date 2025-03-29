import type { Plan } from '../../../src/utils/types';

export async function getPlans(): Promise<Plan[]> {
  const plans = await fetch('/api/plan').then((res) => res.json());
  return plans;
}
