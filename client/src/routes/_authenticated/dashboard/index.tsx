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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
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
import { getPlans } from '@/lib/queries';
import {
  formatImageSize,
  getOtherGuestsStats,
  getTopGuests,
} from '@/lib/utils';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import {
  LockIcon,
  LockOpenIcon,
  PauseIcon,
  SettingsIcon,
  Share2Icon,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import type { Plan } from '../../../../../src/utils/types';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function usePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newData: Record<string, any>) => {
      return fetch('/api/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}

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

              <ShareUploadDialog url={plan.url} />
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
                    src='https://picsum.photos/200'
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
                  className: 'h-full text-muted-foreground',
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

      <Outlet />
    </>
  );
}

function PlanSettingsDialog({ plan }: { plan: Plan }) {
  const mutation = usePlanMutation();

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
            checked={plan.pauseduploads}
            disabled={mutation.isPending}
            onCheckedChange={() => {
              mutation.mutate({
                planId: plan.id,
                pauseduploads: !plan.pauseduploads,
              });
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
          <ChangeNameDialog plan={plan} />

          <div>
            <h2 className=' font-semibold'>
              {plan.pin ? 'Change' : 'Set'} pin
              {plan.pin && (
                <span className='text-xs text-muted-foreground ml-2'>
                  Current pin: {plan.pin}
                </span>
              )}
            </h2>
            <p className='text-xs text-muted-foreground'>
              Set a pin for your event. This will be required to upload images
              to your event.
            </p>
          </div>
          <ChangePinDialog plan={plan} />

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
                disabled={mutation.isPending}
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
                <AlertDialogAction
                  className=' self-center'
                  onClick={() => {
                    mutation.mutate({
                      planId: plan.id,
                      url: true,
                    });
                  }}
                >
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
  const link = 'http://localhost:5173/upload/' + url;

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

function ChangeNameDialog({ plan }: { plan: Plan }) {
  const mutation = usePlanMutation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(plan.eventname);

  useEffect(() => {
    setName(plan.eventname);
  }, [plan.eventname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='self-center'>
          Change Name
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Event Name</DialogTitle>
          <DialogDescription>
            Enter a new name for your event.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={mutation.isPending}
          autoFocus
        />
        <div className='flex gap-2 justify-end'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              mutation.mutate({
                planId: plan.id,
                eventname: name,
                onSuccess: () => setOpen(false),
              })
            }
            disabled={mutation.isPending || !name.trim()}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChangePinDialog({ plan }: { plan: Plan }) {
  const mutation = usePlanMutation();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState(plan.pin ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    setPin(plan.pin ?? '');
    setError('');
  }, [plan.pin, open]);

  const handleSave = () => {
    if (String(pin) && !/^\d{4}$/.test(String(pin))) {
      setError('Pin must be 4 digits or empty to remove.');
      return;
    }
    mutation.mutate({
      planId: plan.id,
      pin: pin === '' ? null : String(pin),
      onSuccess: () => setOpen(false),
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='self-center'>
          {plan.pin ? 'Change Pin' : 'Set Pin'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan.pin ? 'Change Pin' : 'Set Pin'}</DialogTitle>
          <DialogDescription>
            {plan.pin
              ? 'Enter a new pin for your event, or leave blank to remove the pin.'
              : 'Set a pin for your event. Leave blank for no pin.'}
          </DialogDescription>
        </DialogHeader>
        <InputOTP
          type='text'
          maxLength={4}
          value={String(pin)}
          onChange={setPin}
          disabled={mutation.isPending}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        {error && <div className='text-destructive text-xs'>{error}</div>}
        <div className='flex gap-2 justify-end'>
          {plan.pin && (
            <Button
              variant='ghost'
              onClick={() => {
                setPin('');
              }}
              disabled={mutation.isPending}
              className='text-destructive/75 hover:bg-destructive/10 hover:text-destructive'
            >
              Remove Pin
            </Button>
          )}

          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={mutation.isPending}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
