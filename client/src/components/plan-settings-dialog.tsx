import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Plan } from '../../../src/utils/types';
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
} from './ui/alert-dialog';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';

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

export function PlanSettingsDialog({ plan }: { plan: Plan }) {
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
          <PauseUploadSwitch plan={plan} />

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
          <RollURLDialog plan={plan} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PauseUploadSwitch({ plan }: { plan: Plan }) {
  const mutation = usePlanMutation();
  const [paused, setPaused] = useState(plan.pauseduploads);

  useEffect(() => {
    setPaused(plan.pauseduploads);
  }, [plan.pauseduploads]);

  return (
    <Switch
      checked={paused}
      disabled={mutation.isPending}
      onCheckedChange={() => {
        mutation.mutate({
          planId: plan.id,
          pauseduploads: !paused,
        });
      }}
      className='self-center justify-self-center'
    />
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

function RollURLDialog({ plan }: { plan: Plan }) {
  const mutation = usePlanMutation();

  return (
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
            This will invalidate the current URL / QR code and generate a new
            one. Any guests with the old URL / QR code will no longer have
            access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='self-center'>Cancel</AlertDialogCancel>
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
  );
}
