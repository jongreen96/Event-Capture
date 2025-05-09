import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
import {
  LockIcon,
  LockOpenIcon,
  PauseIcon,
  SettingsIcon,
  Share2Icon,
} from 'lucide-react';
import { useContext } from 'react';
import type { Plan } from '../../../../../src/utils/types';

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

          <div className='flex md:flex-row flex-col-reverse gap-2 items-center'>
            <div className='flex gap-2 items-center opacity-50 w-full justify-end'>
              {activePlan.pin ? (
                <LockIcon className='size-4 text-green-500' />
              ) : (
                <LockOpenIcon className='size-4 text-red-500' />
              )}

              {activePlan.pauseduploads ? (
                <PauseIcon className='size-4 text-green-500' />
              ) : null}
            </div>

            <div className='flex gap-2 items-center'>
              <PlanSettingsDialog activePlan={activePlan} />

              <ShareUploadDialog url={activePlan.url} />
            </div>
          </div>
        </div>
      </section>

      <section className='grid grid-cols-2 @3xl:grid-cols-4 gap-4 text-center'>
        <Link to='/dashboard/photos'>
          <Card className='gap-2'>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>

            <CardContent className='text-3xl text-center font-semibold'>
              {activePlan?.images.length}
            </CardContent>
          </Card>
        </Link>

        <Link to='/dashboard/guests'>
          <Card className='gap-2'>
            <CardHeader>
              <CardTitle>Guests</CardTitle>
            </CardHeader>

            <CardContent className='text-3xl text-center font-semibold'>
              {activePlan?.guests.length}
            </CardContent>
          </Card>
        </Link>

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
                {activePlan.guests
                  .map((guest) => ({
                    guest,
                    usage: activePlan.images
                      .filter((image) => image.guestname === guest)
                      .reduce((acc, image) => acc + image.imagesize, 0),
                  }))
                  .sort((a, b) => b.usage - a.usage)
                  .slice(0, guestsVisible)
                  .map(({ guest }) => (
                    <TableRow key={guest}>
                      <TableCell className='max-w-1 truncate'>
                        {guest}
                      </TableCell>
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
                              .map((guest) => ({
                                guest,
                                usage: activePlan.images
                                  .filter((img) => img.guestname === guest)
                                  .reduce((acc, img) => acc + img.imagesize, 0),
                              }))
                              .sort((a, b) => b.usage - a.usage)
                              .slice(0, guestsVisible)
                              .map(({ guest }) => guest)
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
                                .map((guest) => ({
                                  guest,
                                  usage: activePlan.images
                                    .filter((img) => img.guestname === guest)
                                    .reduce(
                                      (acc, img) => acc + img.imagesize,
                                      0
                                    ),
                                }))
                                .sort((a, b) => b.usage - a.usage)
                                .slice(0, guestsVisible)
                                .map(({ guest }) => guest)
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

function PlanSettingsDialog({ activePlan }: { activePlan: Plan }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <SettingsIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan Settings</DialogTitle>
          <DialogDescription>Change your plan settings here</DialogDescription>
        </DialogHeader>

        <Separator />

        <div className='grid grid-cols-[1fr_min-content] gap-4'>
          <div>
            <h2 className=' font-semibold'>Pause uploads</h2>
            <p className='text-xs text-muted-foreground'>
              Pause uploads to your event. This will prevent any new images from
              being uploaded, but will not affect any existing images.
            </p>
          </div>
          <Switch
            checked={activePlan.pauseduploads}
            onCheckedChange={() => {
              activePlan.pauseduploads = !activePlan.pauseduploads;
            }}
            className='self-center justify-self-center'
          />

          <div>
            <h2 className=' font-semibold'>Change event name</h2>
            <p className='text-xs text-muted-foreground'>
              Change the name of your event. This will be visible to your
              guests.
            </p>
          </div>
          <Button variant='outline' className='self-center'>
            Change Name
          </Button>

          <div>
            <h2 className=' font-semibold'>Roll upload URL</h2>
            <p className='text-xs text-muted-foreground'>
              Generate a new upload URL / QR code for your event. This will
              invalidate the current URL / QR code and generate a new one.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                className='bg-destructive/25 hover:bg-destructive/50 self-center'
              >
                Roll URL
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will invalidate the current URL / QR code and generate a
                  new one. Any guests with the old URL / QR code will no longer
                  have access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='self-center' onClick={() => {}}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className=' self-center'>
                  Yes, roll URL
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareUploadDialog({ url }: { url: string }) {
  // TODO: Remove hardcoded URL
  const link = 'http://localhost:5173/upload/' + url;

  // TODO: Add QR code

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Share2Icon /> Share Upload Link
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your upload link</DialogTitle>
          <DialogDescription>
            Share the QR code or the link below with your guests, allowing them
            to upload their images
          </DialogDescription>
        </DialogHeader>

        <div className='flex '>
          <Input readOnly value={link} className='rounded-r-none' />
          <Button
            onClick={() => navigator.clipboard.writeText(link)}
            className='rounded-l-none'
          >
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
