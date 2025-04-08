import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatImageSize } from '@/lib/utils';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ImageIcon, LockIcon, LockOpenIcon, SettingsIcon } from 'lucide-react';
import { useContext } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activePlan } = useContext(PlanContext) as PlanContextType;
  if (!activePlan) return <p>Error loading plans.</p>;

  const photosVisible = 23;
  const guestsVisible = 10;

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
                {formatImageSize(
                  activePlan.images.reduce(
                    (acc, image) => acc + image.imagesize,
                    0
                  ),
                  2
                )}
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

      <section>
        <Card className='bg-sidebar shadow-none p-2 '>
          <CardHeader className='flex items-center justify-between p-0 pl-2 gap-2'>
            <CardTitle className='capitalize overflow-ellipsis'>
              {activePlan?.eventname}
            </CardTitle>

            <div className='flex gap-2 items-center'>
              <div className='flex gap-2 items-center opacity-50'>
                {activePlan.pin ? (
                  <LockIcon className='size-4 text-green-500' />
                ) : (
                  <LockOpenIcon className='size-4 text-red-500' />
                )}
              </div>

              <Button size='icon' variant='outline'>
                <SettingsIcon />
              </Button>

              <Button>Share Link</Button>
            </div>
          </CardHeader>
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
            {activePlan.images.slice(0, photosVisible).map((image) => (
              <Link
                to={`/dashboard/photos/$photoId`}
                params={{ photoId: image.id }}
                key={image.id}
              >
                <Card className='p-0 overflow-hidden aspect-square'>
                  <img
                    src='https://picsum.photos/200'
                    alt={image.imagename}
                    className='size-full object-cover object-center'
                  />
                </Card>
              </Link>
            ))}

            {activePlan.images.length > photosVisible && (
              <Link
                to='/dashboard/photos'
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-full text-muted-foreground',
                })}
              >
                + {activePlan.images.length - photosVisible} more
              </Link>
            )}
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

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className='text-right'>Photos</TableHead>
                  <TableHead className='text-right'>Usage</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {activePlan.guests.slice(0, guestsVisible).map((guest) => (
                  <TableRow key={guest}>
                    <TableCell className='max-w-1 truncate'>{guest}</TableCell>
                    <TableCell className='text-right'>
                      {
                        activePlan.images.filter(
                          (image) => image.guestname === guest
                        ).length
                      }
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatImageSize(
                        activePlan.images
                          .filter((image) => image.guestname === guest)
                          .reduce((acc, image) => acc + image.imagesize, 0),
                        1
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {activePlan.guests.length > guestsVisible && (
                  <TableRow>
                    <TableCell className='text-muted-foreground'>
                      + {activePlan.guests.length - guestsVisible} more
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground'>
                      {
                        activePlan.images.filter(
                          (image) =>
                            !activePlan.guests
                              .slice(0, guestsVisible)
                              .includes(image.guestname)
                        ).length
                      }
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground'>
                      {formatImageSize(
                        activePlan.images
                          .filter(
                            (image) =>
                              !activePlan.guests
                                .slice(0, guestsVisible)
                                .includes(image.guestname)
                          )
                          .reduce((acc, image) => acc + image.imagesize, 0),
                        1
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
