import { getSession } from '@/lib/auth-client';
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';

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

  return <Outlet />;
}
