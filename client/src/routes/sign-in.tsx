import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-separator';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    error: string;
  } => {
    return {
      error: search.error as string,
    };
  },
});

function RouteComponent() {
  const { error } = Route.useSearch();

  return (
    <main className='h-svh flex items-center justify-center'>
      <Card className='w-full sm:w-72 overflow-hidden'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <form className='flex flex-col gap-2'>
            <Input
              type='email'
              name='email'
              id='email-resend'
              placeholder='Enter your email...'
              autoComplete='email'
              required
              className={cn('w-full', error && 'border-red-500')}
            />

            {error && (
              <p className='text-center text-xs text-red-500'>{error}</p>
            )}

            {/* TODO: Add magic link sign up */}
            <Button type='submit' className='w-full'>
              Sign in with Email
            </Button>
          </form>

          <div className='flex items-center justify-center space-x-2'>
            <Separator className='mt-1 w-5/12' />
            <p className='text-center text-muted-foreground'>or</p>
            <Separator className='mt-1 w-5/12' />
          </div>

          <form>
            <Button
              type='submit'
              className='w-full'
              onClick={async (e) => {
                e.preventDefault();

                await signIn.social({
                  provider: 'google',
                  callbackURL: '/dashboard',
                  errorCallbackURL: '/?error=true',
                });
              }}
            >
              Sign in with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className='text-[0.7rem] text-muted-foreground'>
          if you already have an account, we&apos;ll log you in
        </CardFooter>
      </Card>
    </main>
  );
}
