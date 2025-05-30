import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlans } from '@/lib/queries';
import { cn } from '@/lib/utils';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useContext, useState } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/photos')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activePlanId } = useContext(PlanContext) as PlanContextType;

  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const plan = plans.data?.find((plan) => plan.id === activePlanId);
  if (!plan) return <p>Select a plan from the sidebar.</p>;

  const queryClient = useQueryClient();

  const [select, setSelect] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  return (
    <Card className='shadow-none border-0 @container/ic'>
      <CardHeader className='space-y-2 px-0'>
        <Link
          to='/dashboard'
          className={buttonVariants({
            variant: 'ghost',
            className: 'w-fit -mt-14 -ml-4 text-muted-foreground',
          })}
        >
          <ChevronLeft />
          Overview
        </Link>
        <div className='flex items-center justify-between'>
          <CardTitle>All Photos</CardTitle>
          <div className='flex items-center gap-2'>
            {select && selectedImages.length > 0 ? (
              <Button
                variant='destructive'
                onClick={async () => {
                  await fetch('/api/photos', {
                    method: 'DELETE',
                    body: JSON.stringify({ photoId: selectedImages }),
                    headers: { 'Content-Type': 'application/json' },
                  });
                  setSelectedImages([]);
                  setSelect(false);
                  queryClient.invalidateQueries({ queryKey: ['plans'] });
                }}
              >
                Delete Selected ({selectedImages.length})
              </Button>
            ) : null}
            <Button
              variant='outline'
              onClick={() => {
                setSelect(!select);
                if (!select) setSelectedImages([]);
              }}
            >
              {select ? 'Cancel' : 'Select'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='grid p-0 gap-2 grid-cols-2 @xs/ic:grid-cols-3 @md/ic:grid-cols-4 @xl/ic:grid-cols-5 @2xl/ic:grid-cols-6 @4xl/ic:grid-cols-8 @6xl/ic:grid-cols-10'>
        {plan?.images.map((image) => (
          <Link
            to={`/dashboard/photos/$photoId`}
            params={{ photoId: image.id }}
            key={image.id}
            disabled={select}
            onMouseDown={() => {
              if (select) {
                setSelectedImages((prev) =>
                  prev.includes(image.id)
                    ? prev.filter((id) => id !== image.id)
                    : [...prev, image.id]
                );
              }
            }}
          >
            <Card className='p-0 overflow-hidden aspect-square relative cursor-pointer'>
              <img
                src={`https://images.jongreen.dev/${image.imagename}-preview`}
                alt={image.imagename}
                className={cn(
                  'size-full object-cover object-center',
                  select && 'opacity-50 hover:opacity-75',
                  selectedImages.includes(image.id) && 'opacity-100'
                )}
              />
            </Card>
          </Link>
        ))}
      </CardContent>

      <Outlet />
    </Card>
  );
}
