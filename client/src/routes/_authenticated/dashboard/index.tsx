import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { createFileRoute, Link } from '@tanstack/react-router';
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
                ).toFixed(1)}{' '}
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

      <section className='grid gap-4 @3xl:grid-cols-[2fr_1fr]'>
        <Card className='shadow-none border-0 @container/ic'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Photos
              <Link
                to='/dashboard/photos'
                className={buttonVariants({ variant: 'outline' })}
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent className='grid gap-2 grid-cols-2 @xs/ic:grid-cols-3 @md/ic:grid-cols-4 @xl/ic:grid-cols-5 @2xl/ic:grid-cols-6'>
            {activePlan.images.map((image) => (
              <Link to={`/dashboard/photos/${image.id}`}>
                <Card className='p-0 overflow-hidden aspect-square'>
                  <img
                    src='https://picsum.photos/200'
                    alt={image.imagename}
                    className='size-full object-cover object-center'
                  />
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className='shadow-none border-0'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Guests
              <Link
                to='/dashboard/guests'
                className={buttonVariants({ variant: 'outline' })}
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
        </Card>
      </section>
    </>
  );
}
