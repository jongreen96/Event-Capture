import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession, signIn } from '@/lib/auth-client';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    error: string | undefined;
  } => {
    return {
      error: search.error as string | undefined,
    };
  },
  beforeLoad: async () => {
    const session = (await getSession()).data;
    if (session) {
      throw redirect({
        to: '/dashboard',
      });
    }
    return session;
  },
});

function RouteComponent() {
  return (
    <main className='h-svh flex items-center justify-center'>
      <Card className='w-full sm:w-72 overflow-hidden shadow-none border-none'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <form>
            <Button
              type='submit'
              className='w-full'
              onClick={async (e) => {
                e.preventDefault();

                await signIn.social({
                  provider: 'google',
                  callbackURL: '/dashboard',
                  newUserCallbackURL: '/plans',
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
