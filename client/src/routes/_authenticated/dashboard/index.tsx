import ShareUploadDialog from '@/components/share-upload-dialog';
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
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { SettingsIcon } from 'lucide-react';
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
      <section>
        <div className='flex items-center justify-between p-0 pl-2 gap-2'>
          <p className='capitalize overflow-ellipsis font-semibold text-xl md:text-2xl lg:text-3xl line-clamp-3'>
            {activePlan?.eventname}
          </p>

          <div className='flex gap-2 items-center'>
            {/* <div className='flex gap-2 items-center opacity-50'>
              {activePlan.pin ? (
                <LockIcon className='size-4 text-green-500' />
              ) : (
                <LockOpenIcon className='size-4 text-red-500' />
              )}
            </div> */}

            <Button size='icon' variant='outline'>
              <SettingsIcon />
            </Button>

            <ShareUploadDialog url={activePlan.url} />
          </div>
        </div>
      </section>

      <section className='grid grid-cols-2 @3xl:grid-cols-4 gap-4 text-center'>
        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>

          <CardContent className='text-3xl text-center font-semibold'>
            {activePlan?.images.length}
          </CardContent>
        </Card>

        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Guests</CardTitle>
          </CardHeader>

          <CardContent className='text-3xl text-center font-semibold'>
            {activePlan?.guests.length}
          </CardContent>
        </Card>

        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>

          <CardContent className='text-3xl text-center font-semibold'>
            {formatImageSize(
              activePlan.images.reduce(
                (acc, image) => acc + image.imagesize,
                0
              ),
              2
            )}
          </CardContent>
        </Card>

        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
          </CardHeader>

          <CardContent className='text-3xl text-center font-semibold capitalize'>
            {activePlan?.plan}
          </CardContent>
        </Card>
      </section>

      <section className='grid gap-10 @3xl:grid-cols-[2fr_1fr]'>
        <Card className='shadow-none border-0 @container/ic'>
          <CardHeader className='px-0'>
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

          <CardContent className='grid px-0 gap-2 grid-cols-2 @2xs/ic:grid-cols-3 @sm/ic:grid-cols-4 @xl/ic:grid-cols-5 @2xl/ic:grid-cols-6'>
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
          <CardHeader className='px-0'>
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

          <CardContent className='px-0'>
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

      <Outlet />
    </>
  );
}
