import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getPlans } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/dashboard/photos/$photoId'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { photoId } = Route.useParams();

  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const image = plans.data
    ?.find((plan) => plan.images.some((img) => img.id === photoId))
    ?.images.find((img) => img.id === photoId);
  if (!image) return <Navigate to='/dashboard/photos' />;

  return (
    <Dialog
      defaultOpen
      onOpenChange={() => {
        navigate({ to: `/dashboard/photos` });
      }}
    >
      <DialogContent className='max-h-[calc(100svh-2rem)]'>
        <DialogHeader className='flex-row items-center justify-between'>
          <div className='space-y-2'>
            <DialogTitle>
              {image.imagename.split('/')[2].split('.')[0]}
            </DialogTitle>
            <DialogDescription>
              Uploaded by: {image.guestname}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant='outline' size='icon'>
              <XIcon />
              <span className='sr-only'>Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='flex-1 flex items-center justify-center overflow-hidden'>
          <img
            src={`https://images.jongreen.dev/${image.imagename}`}
            alt={image.imagename}
            className='w-full h-full object-contain rounded'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
