import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlans } from '@/lib/queries';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  ChartColumnIcon,
  FileBarChart2Icon,
  ImageIcon,
  UserIcon,
} from 'lucide-react';
import { useContext } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const { activePlan } = useContext(PlanContext) as PlanContextType;

  if (plans.isLoading) {
    return <p>Loading...</p>;
  }

  if (plans.isError) {
    return <p>Error loading plans.</p>;
  }

  return (
    <>
      <section className='grid grid-cols-2 @3xl:grid-cols-4 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ImageIcon className='size-4' />
              Photos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>{activePlan?.images.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserIcon className='size-4' />
              Guests
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              {activePlan?.images
                ? new Set(activePlan.images.map((image) => image.guestname))
                    .size
                : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ChartColumnIcon className='size-4' />
              Usage
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>{/* TODO */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileBarChart2Icon className='size-4' />
              Plan
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>{activePlan?.plan}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
