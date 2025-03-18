import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <>
      <section className='flex items-center lg:h-[50vh] shadow-sm'>
        <div className='max-w-7xl w-full mx-auto flex flex-col items-center justify-around gap-6 p-4 lg:min-h-96 lg:flex-row'>
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

          <Card className='w-full sm:w-72 overflow-hidden'>
            <CardContent className='space-y-4'>
              <form className='flex flex-col gap-2'>
                <Input
                  type='email'
                  name='email'
                  id='email-resend'
                  placeholder='Enter your email...'
                  autoComplete='email'
                  required
                  className='w-full'
                />

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
        </div>
      </section>

      <main className='mx-auto max-w-7xl flex flex-col gap-16'>
        <section className='flex flex-col items-center mt-16 justify-evenly gap-4 p-4 md:flex-row'>
          <Card className='transition-all md:w-96'>
            <CardContent className='p-4'>
              &quot;Event Capture made our wedding unforgettable! All our guests
              were able to share their photos easily, and we got to relive the
              day from so many perspectives. The QR code feature was super
              convenient, and managing the photos afterward was a breeze. Highly
              recommend this for any event!&quot;
            </CardContent>

            <CardFooter className='justify-end font-semibold'>
              - Sarah and Mark *
            </CardFooter>
          </Card>

          <Card className='transition-all md:w-96'>
            <CardContent className='p-4'>
              &quot;We used Event Capture for our company&apos;s annual
              conference, and it was a game-changer. Instead of hiring multiple
              photographers, we let our attendees capture the moments. The
              platform made it so easy to collect and download all the images,
              ensuring we didn&apos;t miss a single highlight. It&apos;s a
              must-have for any large event.&quot;
            </CardContent>

            <CardFooter className='justify-end font-semibold'>
              - John Reynolds, CEO *
            </CardFooter>
          </Card>

          <Card className='transition-all md:w-96'>
            <CardContent className='p-4'>
              &quot;As a party planner, Event Capture has become one of my go-to
              tools. It allows my clients to see their event through the eyes of
              their guests, which is something truly special. The simplicity of
              creating a QR code and having everyone contribute photos is
              unmatched. This service elevates any event!&quot;
            </CardContent>

            <CardFooter className='justify-end font-semibold'>
              - Emily Carter, Event Planner *
            </CardFooter>
          </Card>
        </section>

        <section className='flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Seamless Event Management with the Dashboard Page
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Easily manage your event&apos;s photos with our intuitive Dashboard
            Page. Organize, review, and download all shared images with just a
            few clicks. Stay in control and ensure only the best memories are
            preserved.
          </p>

          <Card className='mt-4 w-full p-0 overflow-hidden bg-muted lg:w-3/4'>
            <img src='/images/pic-1.png' alt='Event Capture Image' />
          </Card>
        </section>

        <section className='flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Capture every moment effortlessly
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Never miss a moment with Event Capture. Generate a unique QR code,
            share it with your guests, and collect all their photos in one
            place. Relive your event through the eyes of everyone who was there,
            capturing every angle effortlessly.
          </p>

          <div className='mt-4 grid w-full grid-cols-3 grid-rows-2 gap-2 lg:w-3/4'>
            <Card className='col-end-2 p-0 row-start-1 row-end-3 h-full w-full overflow-hidden'>
              <img
                src='/images/pic-2.png'
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
            <Card className='col-start-2 p-0 col-end-4 row-start-1 row-end-2 aspect-video h-full w-full overflow-hidden bg-muted'>
              <img
                src='/images/pic-3.png'
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
            <Card className='col-start-2 p-0 col-end-4 row-start-2 row-end-3 aspect-video h-full w-full overflow-hidden bg-muted'>
              <img
                src='/images/pic-4.png'
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
          </div>
        </section>

        <section className='flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Guest-Friendly and Easy to Use
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Event Capture is designed with your guests in mind. Participating is
            a breeze, no complicated steps, just simple and seamless photo
            sharing. Everyone can contribute effortlessly, ensuring your event
            memories are complete and vibrant.
          </p>

          <Card className='mt-4 p-0 w-full overflow-hidden bg-muted lg:w-3/4'>
            <img
              src='/images/pic-5.png'
              alt='Event Capture Image'
              className='w-full object-cover'
            />
          </Card>
        </section>

        {/* <Plans reference /> */}

        <section className='flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Secure and Private
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Your memories are precious, and so is your privacy. Event Capture
            ensures that all photos are securely stored and only accessible to
            you. With robust privacy controls and encrypted storage, you can
            trust that your event&apos;s moments are protected, giving you peace
            of mind while reliving your special day.
          </p>

          <div className='mt-4 grid w-full grid-cols-3 gap-2 lg:w-3/4'>
            <Card className='h-full p-0 w-full overflow-hidden'>
              <img
                src='/images/pic-6.png'
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
            <Card className='h-full p-0 w-full overflow-hidden'>
              <img
                src='/images/pic-7.png'
                alt='Event Capture Image'
                className='h-full w-full object-cover'
              />
            </Card>
            <Card className='h-full p-0 w-full overflow-hidden'>
              <img
                src='/images/pic-8.png'
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
