import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/dashboard/guests')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className='shadow-none border-0 @container/ic'>
      <CardHeader className='space-y-2'>
        <Link
          to='/dashboard'
          className='flex items-center text-xs font-medium text-muted-foreground'
        >
          <ChevronLeft className='size-4' />
          Overview
        </Link>
        <CardTitle>All Guests</CardTitle>
      </CardHeader>

      <CardContent className='grid gap-2 grid-cols-2 @xs/ic:grid-cols-3 @md/ic:grid-cols-4 @xl/ic:grid-cols-5 @2xl/ic:grid-cols-6 @4xl/ic:grid-cols-8 @6xl/ic:grid-cols-10'>
        guests
      </CardContent>
    </Card>
  );
}
