import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getPlans } from '@/lib/queries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from '@tanstack/react-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  Loader2,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

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

  // Handle loading and error states
  if (plans.isLoading) return <div>Loading...</div>;
  if (plans.isError) return <div>Error loading plans.</div>;

  // Find the plan and image in a single pass
  const plan = plans.data?.find((plan) =>
    plan.images.some((img) => img.id === photoId)
  );
  const image = plan?.images.find((img) => img.id === photoId);
  if (!image) return <Navigate to='/dashboard/photos' />;

  const images = plan?.images ?? [];
  const currentIndex = images.findIndex((img) => img.id === photoId);
  const nextImage =
    images.length > 0 ? images[(currentIndex + 1) % images.length] : undefined;
  const prevImage =
    images.length > 0
      ? images[(currentIndex - 1 + images.length) % images.length]
      : undefined;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog
      defaultOpen
      onOpenChange={() => {
        navigate({ to: `/dashboard/photos` });
      }}
    >
      <DialogContent className='max-h-[calc(100svh-2rem)] p-2'>
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

        <div className='flex-1 flex items-center min-h-60 justify-center relative'>
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded'>
              <Loader2 className='animate-spin h-10 w-10 text-gray-500' />
            </div>
          )}
          <img
            src={`https://images.jongreen.dev/${image.imagename}`}
            alt={image.imagename}
            className='w-full h-full max-h-[70vh] object-contain rounded'
            fetchPriority='high'
            loading='eager'
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>

        <DialogFooter className='grid grid-cols-3 gap-2'>
          {prevImage && (
            <Link
              to='/dashboard/photos/$photoId'
              params={{ photoId: prevImage.id }}
              className={buttonVariants({
                className: 'w-full',
                variant: 'outline',
              })}
            >
              <ChevronLeftIcon />
              Previous
            </Link>
          )}

          <div className='flex items-center justify-center gap-2'>
            <Button variant='outline' size='icon' asChild>
              <a
                href={`https://images.jongreen.dev/${image.imagename}`}
                download
              >
                <DownloadIcon />
                <span className='sr-only'>Download</span>
              </a>
            </Button>

            <DeleteButton
              photoId={photoId}
              nextPhotoId={nextImage?.id}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {nextImage && (
            <Link
              to='/dashboard/photos/$photoId'
              params={{ photoId: nextImage.id }}
              className={buttonVariants({
                className: 'w-full',
                variant: 'outline',
              })}
            >
              Next
              <ChevronRightIcon />
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({
  photoId,
  nextPhotoId,
  isLoading,
  setIsLoading,
}: {
  photoId: string;
  nextPhotoId?: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (photoId: string) => {
      return fetch(`/api/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId: [photoId] }),
      });
    },
    onSettled: () => {
      if (nextPhotoId)
        navigate({
          to: `/dashboard/photos/$photoId`,
          params: { photoId: nextPhotoId },
        });
      else navigate({ to: `/dashboard/photos` });
      setIsLoading(false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  if (mutation.isPending)
    return (
      <Button variant='outline' size='icon'>
        <Loader2 className='animate-spin' />
        <span className='sr-only'>Deleting</span>
      </Button>
    );

  return (
    <Button
      variant='outline'
      size='icon'
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        mutation.mutate(photoId);
      }}
      className='bg-red-500/25 hover:bg-red-500/75'
    >
      <Trash2Icon />
      <span className='sr-only'>Delete</span>
    </Button>
  );
}
