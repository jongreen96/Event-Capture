import { PlanSettingsDialog } from '@/components/plan-settings-dialog';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPlans } from '@/lib/queries';
import {
  formatImageSize,
  getOtherGuestsStats,
  getTopGuests,
} from '@/lib/utils';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { LockIcon, LockOpenIcon, PauseIcon, Share2Icon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import QR from 'react-qr-code';
import type { Plan } from '../../../../../src/utils/types';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activePlanId } = useContext(PlanContext) as PlanContextType;
  if (!activePlanId) return <p>Error loading plans.</p>;

  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const plan = plans.data?.find((plan) => plan.id === activePlanId);
  if (!plan) return <p>Select a plan from the sidebar.</p>;

  const photosVisible = 23;
  const guestsVisible = 10;

  return (
    <>
      <section>
        <div className='flex items-center justify-between p-0 pl-2 gap-2'>
          <p className='capitalize overflow-ellipsis font-semibold text-xl md:text-2xl lg:text-3xl line-clamp-3'>
            {plan?.eventname}
          </p>

          <div className='flex md:flex-row flex-col-reverse gap-2 items-center'>
            <div className='flex gap-2 items-center opacity-50 w-full justify-end'>
              {plan.pin ? (
                <LockIcon className='size-4 text-green-500' />
              ) : (
                <LockOpenIcon className='size-4 text-red-500' />
              )}

              {plan.pauseduploads ? (
                <PauseIcon className='size-4 text-green-500' />
              ) : null}
            </div>

            <div className='flex gap-2 items-center'>
              <PlanSettingsDialog plan={plan} />

              <ShareUploadDialog plan={plan} />
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
              {plan?.images.length}
            </CardContent>
          </Card>
        </Link>

        <Link to='/dashboard/guests'>
          <Card className='gap-2'>
            <CardHeader>
              <CardTitle>Guests</CardTitle>
            </CardHeader>

            <CardContent className='text-3xl text-center font-semibold'>
              {plan?.guests.length}
            </CardContent>
          </Card>
        </Link>

        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>

          <CardContent className='text-3xl text-center font-semibold'>
            {formatImageSize(
              plan?.images.reduce((acc, image) => acc + image.imagesize, 0),
              2
            )}
          </CardContent>
        </Card>

        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
          </CardHeader>

          <CardContent className='text-3xl text-center font-semibold capitalize'>
            {plan?.plan}
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
            {plan?.images.slice(0, photosVisible).map((image) => (
              <Link
                to={`/dashboard/photos/$photoId`}
                params={{ photoId: image.id }}
                key={image.id}
              >
                <Card className='p-0 overflow-hidden aspect-square'>
                  <img
                    src={`https://images.jongreen.dev/${image.imagename}-preview`}
                    alt={image.imagename}
                    className='size-full object-cover object-center'
                  />
                </Card>
              </Link>
            ))}

            {plan?.images.length > photosVisible && (
              <Link
                to='/dashboard/photos'
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-full text-muted-foreground rounded-xl',
                })}
              >
                + {plan?.images.length - photosVisible} more
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
                {getTopGuests(plan, guestsVisible).map(
                  ({ guest }: { guest: string }) => (
                    <TableRow key={guest}>
                      <TableCell className='max-w-1 truncate'>
                        {guest}
                      </TableCell>
                      <TableCell className='text-right'>
                        {
                          plan.images.filter(
                            (image) => image.guestname === guest
                          ).length
                        }
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatImageSize(
                          plan.images
                            .filter((image) => image.guestname === guest)
                            .reduce((acc, image) => acc + image.imagesize, 0),
                          1
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}

                {plan.guests.length > guestsVisible && (
                  <TableRow>
                    <TableCell className='text-muted-foreground'>
                      + {getOtherGuestsStats(plan, guestsVisible).count} more
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground'>
                      {getOtherGuestsStats(plan, guestsVisible).photoCount}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground'>
                      {formatImageSize(
                        getOtherGuestsStats(plan, guestsVisible).usage,
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

function ShareUploadDialog({ plan }: { plan: Plan }) {
  const link = 'http://localhost:5173/upload/' + plan.url;

  const [showPin, setShowPin] = useState(false);

  // Hide PIN after 5s
  useEffect(() => {
    if (showPin) {
      const timer = setTimeout(() => setShowPin(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPin]);

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

        <QR
          value={link}
          className='m-auto my-6 rounded border-8 border-white'
        />

        {plan.pin ? (
          showPin ? (
            <InputOTP value={String(plan.pin)} maxLength={4}>
              <InputOTPGroup className='m-auto'>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          ) : (
            <Button
              variant='outline'
              className='w-fit m-auto'
              onClick={() => {
                setShowPin(true);
              }}
            >
              Show PIN
            </Button>
          )
        ) : (
          <p className='text-muted-foreground text-sm text-center'>
            This link is public and does not require a PIN to upload images.{' '}
            <br /> We recommend setting a PIN for added security. Without a PIN,
            anyone with the link can upload images.
          </p>
        )}

        <div className='flex'>
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
