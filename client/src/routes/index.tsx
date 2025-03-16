import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: (
    search: Record<string, unknown>
  ): { error: string; success: boolean } => {
    return { error: 't', success: true };
  },
});

function App() {
  const { error, success } = Route.useSearch();
  return (
    <main>
      <section className='flex items-center bg-hero bg-cover bg-center lg:h-[50vh]'>
        <div className='container flex flex-col items-center justify-around space-y-6 p-4 lg:min-h-96 lg:flex-row'>
          <div className='max-w-prose space-y-6 text-lg font-semibold'>
            <h1 className='text-4xl font-semibold'>
              <span className='text-5xl font-bold'>Event Capture</span>
              <br />
              Never miss the moment.
            </h1>

            <p>
              Capture every moment of an event effortlessly from all angles with
              the help of all your guests.
            </p>

            <ul className='space-y-2'>
              <li>🎉 Effortlessly generate a unique QR code for your event</li>
              <li>
                📸 Invite guests to capture and share their favorite moments
              </li>
              <li>
                🗂️ Seamlessly collect, organize, and download all shared photos
              </li>
              <li>💕 Preserve every memory with no moment left behind</li>
              <li>💌 Enjoy a hassle-free experience from start to finish</li>
            </ul>
          </div>

          <Card className='w-full max-w-prose lg:w-72'>
            <CardContent className='p-4'>
              <form className='flex flex-col space-y-2'>
                <Input
                  type='email'
                  name='email'
                  id='email-resend'
                  placeholder='Enter your email...'
                  autoComplete='email'
                  autoFocus
                  required
                  className={cn(
                    'w-full',
                    error && 'border-red-500',
                    success && 'border-green-500'
                  )}
                />

                {error && (
                  <p className='text-center text-sm text-red-500'>{error}</p>
                )}
                {success && (
                  <p className='text-center text-sm text-green-500'>
                    Check your email for a confirmation link
                  </p>
                )}

                <Button type='submit' className='w-full'>
                  Sign in with Email
                </Button>

                <div className='flex items-center justify-center space-x-2'>
                  <Separator className='mt-1 w-5/12' />
                  <p className='text-center text-muted-foreground'>or</p>
                  <Separator className='mt-1 w-5/12' />
                </div>
              </form>

              <form className='mt-3'>
                <Button type='submit' className='w-full'>
                  Sign in with Google
                </Button>
              </form>
            </CardContent>
            <CardFooter className='-mt-3 pb-2 text-[0.7rem] text-muted-foreground'>
              if you already have an account, we&apos;ll log you in
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
