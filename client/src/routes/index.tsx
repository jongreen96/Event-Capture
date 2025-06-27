import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/auth-client';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
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

function App() {
  return (
    <>
      <section
        className='flex items-center lg:h-[50vh] shadow-sm relative text-white'
        style={{
          backgroundImage: "url('/images/hero-img.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='absolute inset-0 bg-black/50 pointer-events-none' />
        <div className='relative max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-6 p-4 lg:min-h-96 '>
          <div className='max-w-prose text-lg font-semibold '>
            <h1 className='text-4xl text-center font-semibold'>
              <span className='text-5xl font-bold'>Event Capture</span>
              <br />
              Never miss the moment.
            </h1>
          </div>

          <div>
            <Link
              to='/sign-in'
              search={{ error: undefined }}
              className={buttonVariants({ variant: 'secondary' })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <main className='mx-auto max-w-7xl flex flex-col gap-16'>
        <section className='flex flex-col items-center mt-16 justify-evenly gap-4 p-4 md:flex-row'>
          <Card className='md:w-96'>
            <CardHeader>
              <CardTitle>Easy Photo Collection</CardTitle>
            </CardHeader>
            <CardContent>
              Guests can easily upload photos directly from their devices,
              ensuring no one misses out on sharing their memories.
            </CardContent>
          </Card>

          <Card className='md:w-96'>
            <CardHeader>
              <CardTitle>Lossless Quality</CardTitle>
            </CardHeader>
            <CardContent>
              Maintain the original quality of your photos with our lossless
              upload process, preserving every detail.
            </CardContent>
          </Card>

          <Card className='md:w-96'>
            <CardHeader>
              <CardTitle>Secure Access</CardTitle>
            </CardHeader>
            <CardContent>
              Control who can view and contribute to your event's photo
              collection with our secure access features.
            </CardContent>
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
            <img src='/images/pic-1-new.png' alt='Event Capture Image' />
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

      <footer className='mt-16 max-w-7xl mx-auto p-4 grid grid-cols-3 items-center justify-evenly'>
        <div></div>
        <p className='text-center text-muted-foreground'>
          Event Capture - {new Date().getFullYear()}
        </p>
        <p className='text-right text-muted-foreground'>
          Created by -{' '}
          <a
            href='https://jongreen.dev'
            target='_blank'
            className='underline text-blue-400'
          >
            jongreen.dev
          </a>
        </p>
      </footer>
    </>
  );
}
