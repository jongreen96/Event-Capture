import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { createFileRoute } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';
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
        <Card className='gap-0'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='size-4' />
                Photos
              </div>
              <span className='text-xl text-right font-semibold'>
                {activePlan?.images.length}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent></CardContent>
        </Card>

        <Card className='gap-0'>
          <CardHeader>
            <CardTitle className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='size-4' />
                Guests
              </div>
              <span className='text-xl text-right font-semibold'>
                {activePlan?.guests.length}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent></CardContent>
        </Card>

        <Card className='gap-0'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='size-4' />
                Usage
              </div>
              <span className='text-xl text-right font-semibold'>
                {(
                  activePlan.images.reduce(
                    (acc, image) => acc + image.imagesize,
                    0
                  ) / 1_048_578
                ).toFixed(2)}{' '}
                GB
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent></CardContent>
        </Card>

        <Card className='gap-0'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='size-4' />
                Plan
              </div>
              <span className='text-xl text-right font-semibold'>
                {activePlan?.plan}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent></CardContent>
        </Card>
      </section>
    </>
  );
}
