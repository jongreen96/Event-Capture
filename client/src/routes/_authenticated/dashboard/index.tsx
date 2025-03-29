import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlans } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  ChartColumnIcon,
  FileBarChart2Icon,
  ImageIcon,
  UserIcon,
} from 'lucide-react';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

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
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserIcon className='size-4' />
              Guests
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ChartColumnIcon className='size-4' />
              Usage
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileBarChart2Icon className='size-4' />
              Plan
            </CardTitle>
          </CardHeader>
        </Card>
      </section>
    </>
  );
}
