import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlans } from '@/lib/queries';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useContext } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/photos')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activePlanId } = useContext(PlanContext) as PlanContextType;

  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const plan = plans.data?.find((plan) => plan.id === activePlanId);
  if (!plan) return <p>Select a plan from the sidebar.</p>;

  return (
    <Card className='shadow-none border-0 @container/ic'>
      <CardHeader className='space-y-2'>
        <Link
          to='/dashboard'
          className={buttonVariants({
            variant: 'ghost',
            className: 'w-fit -mt-14 -ml-4 text-muted-foreground',
          })}
        >
          <ChevronLeft />
          Overview
        </Link>
        <CardTitle>All Photos</CardTitle>
      </CardHeader>

      <CardContent className='grid gap-2 grid-cols-2 @xs/ic:grid-cols-3 @md/ic:grid-cols-4 @xl/ic:grid-cols-5 @2xl/ic:grid-cols-6 @4xl/ic:grid-cols-8 @6xl/ic:grid-cols-10'>
        {plan?.images.map((image) => (
          <Link
            to={`/dashboard/photos/$photoId`}
            params={{ photoId: image.id }}
            key={image.id}
          >
            <Card className='p-0 overflow-hidden aspect-square'>
              <img
                src={`https://images.event-capture.jongreen.dev/${image.imagename}-preview`}
                alt={image.imagename}
                className='size-full object-cover object-center'
              />
            </Card>
          </Link>
        ))}
      </CardContent>

      <Outlet />
    </Card>
  );
}
