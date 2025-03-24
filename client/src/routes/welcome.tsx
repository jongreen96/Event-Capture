import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/welcome')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const purchasePlan = async (plan: string) => {
    const res = await fetch(`/api/plan/create/${plan}`, {
      method: 'POST',
    });
    if (res.ok) {
      navigate({ to: '/dashboard' });
    } else {
      const errorMessage = await res.json();
      setError(errorMessage.error || 'Failed to create plan');
      console.error('Failed to create plan:', res.statusText);
    }
  };

  return (
    <main className='pt-18 min-h-svh flex items-center justify-center'>
      <Card className='w-full max-w-7xl overflow-hidden shadow-none text-center border-none'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            Welcome to <br /> Event Capture
            <p className='text-base font-normal'>Select a plan below:</p>
            {error && (
              <p className='text-red-500 text-base font-semibold'>{error}</p>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardTitle>Trial</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <ul>
                <li>100MB storage limit</li>
                <li>~20 images @ 5MB each</li>
                <li>Instant image downloads</li>
                <li>Unlimited guests</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className='w-full' onClick={() => purchasePlan('trial')}>
                Purchase
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Small</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <ul>
                <li>5GB storage limit</li>
                <li>~1,000 images @ 5MB each</li>
                <li>Instant image downloads</li>
                <li>Unlimited guests</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className='w-full' onClick={() => purchasePlan('small')}>
                Purchase
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medium</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <ul>
                <li>50GB storage limit</li>
                <li>~10,000 images @ 5MB each</li>
                <li>Instant image downloads</li>
                <li>Unlimited guests</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className='w-full' onClick={() => purchasePlan('medium')}>
                Purchase
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Large</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <ul>
                <li>250GB storage limit</li>
                <li>~50,000 images @ 5MB each</li>
                <li>Instant image downloads</li>
                <li>Unlimited guests</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className='w-full' onClick={() => purchasePlan('large')}>
                Purchase
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
        <CardFooter>
          <Link
            to='/dashboard'
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full max-w-64 mx-auto',
            })}
          >
            Go to Dashboard
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
