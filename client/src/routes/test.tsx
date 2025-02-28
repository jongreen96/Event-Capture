import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: () =>
      fetch('/api/test')
        .then((response) => response.json())
        .then((data) => data as { message: string }),
    initialData: { message: 'Loading...' },
  });
  return <div>Hello "/test"! {data?.message}</div>;
}
