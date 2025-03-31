import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
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
  const { activePlan } = useContext(PlanContext) as PlanContextType;

  if (!activePlan) {
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
            <p>{activePlan.guests.length}</p>
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
