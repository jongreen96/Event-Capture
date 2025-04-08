import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';
import { useContext } from 'react';

export const Route = createFileRoute(
  '/_authenticated/dashboard/photos/$photoId'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { photoId } = Route.useParams();

  const { activePlan } = useContext(PlanContext) as PlanContextType;
  if (!activePlan) return <p>Error loading plans.</p>;

  const image = activePlan.images.find((img) => img.id === photoId);
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
          <DialogTitle>{image.imagename}</DialogTitle>
          <DialogClose asChild>
            <Button variant='outline' size='icon'>
              <XIcon />
              <span className='sr-only'>Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='flex-1 flex items-center justify-center overflow-hidden'>
          <img
            src={image.imageurl}
            alt={image.imagename}
            className='w-full h-full object-contain rounded'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
