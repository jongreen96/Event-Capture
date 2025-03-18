import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/summary')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/summary"!</div>;
}
