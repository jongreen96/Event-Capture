import { getSession } from '@/lib/auth-client';
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { createContext, useEffect, useState } from 'react';
import type { Plan } from '../../../src/utils/types';

export type PlanContextType = {
  activePlan: Plan | null;
  setActivePlan: React.Dispatch<React.SetStateAction<Plan | null>>;
};

export const PlanContext = createContext<PlanContextType | null>(null);

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = (await getSession()).data;
    if (!session) {
      throw redirect({
        to: '/sign-in',
        search: { error: undefined },
      });
    }

    return session;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { session } = Route.useRouteContext();
  if (!session) navigate({ to: '/sign-in', search: { error: undefined } });

  const [activePlan, setActivePlan] = useState<null | Plan>(() => {
    const stored = sessionStorage.getItem('activePlan');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (activePlan) {
      sessionStorage.setItem('activePlan', JSON.stringify(activePlan));
    } else {
      sessionStorage.removeItem('activePlan');
    }
  }, [activePlan]);

  return (
    <PlanContext.Provider value={{ activePlan, setActivePlan }}>
      <Outlet />
    </PlanContext.Provider>
  );
}
