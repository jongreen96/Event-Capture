import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useContext } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/photos/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activePlan } = useContext(PlanContext) as PlanContextType;
  if (!activePlan) {
    return <p>Error loading plans.</p>;
  }

  return (
    <Card className='shadow-none border-0 @container/ic'>
      <CardHeader>
        <CardTitle>All Photos</CardTitle>
      </CardHeader>

      <CardContent className='grid gap-2 grid-cols-2 @xs/ic:grid-cols-3 @md/ic:grid-cols-4 @xl/ic:grid-cols-5 @2xl/ic:grid-cols-6 @4xl/ic:grid-cols-8 @6xl/ic:grid-cols-10'>
        {activePlan.images.map((image) => (
          <Link
            to={`/dashboard/photos/$photoId`}
            params={{ photoId: image.id }}
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
      </CardContent>
    </Card>
  );
}
