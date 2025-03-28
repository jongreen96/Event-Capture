import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/welcome')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className='h-svh flex items-center justify-center'>
      <Card className='w-full sm:w-72 overflow-hidden shadow-none border-none'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome to <br /> Event Capture
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-muted-foreground'>
            {/* TODO: Write introduction */}
            Something... something... inspirational
          </p>
          <p>Select a plan to get started!</p>
        </CardContent>
        <CardFooter>
          <Link to='/plans' className={buttonVariants({ className: 'w-full' })}>
            Select a Plan
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
