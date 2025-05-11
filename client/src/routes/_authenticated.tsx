import { getSession } from '@/lib/auth-client';
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { createContext, useEffect, useState } from 'react';

export type PlanContextType = {
  activePlanId: string | null;
  setActivePlanId: React.Dispatch<React.SetStateAction<string | null>>;
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

  const [activePlanId, setActivePlanId] = useState<null | string>(() => {
    const stored = sessionStorage.getItem('activePlanId');
    return stored ? stored : null;
  });

  useEffect(() => {
    if (activePlanId) {
      sessionStorage.setItem('activePlanId', activePlanId);
    } else {
      sessionStorage.removeItem('activePlanId');
    }
  }, [activePlanId]);

  return (
    <PlanContext.Provider value={{ activePlanId, setActivePlanId }}>
      <Outlet />
    </PlanContext.Provider>
  );
}
