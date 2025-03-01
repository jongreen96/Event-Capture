import SignUpForm from './components/sign-up-form';
import { Card, CardContent, CardFooter } from './components/ui/card';

import pic1 from '/pic-1.png';
import pic2 from '/pic-2.png';
import pic3 from '/pic-3.png';
import pic4 from '/pic-4.png';
import pic5 from '/pic-5.png';
import pic6 from '/pic-6.png';
import pic7 from '/pic-7.png';
import pic8 from '/pic-8.png';

function App() {
  return (
    <>
      <main className='flex flex-col gap-8 items-center'>
        <section
          id='hero'
          className='flex w-full justify-center items-center bg-hero bg-cover bg-center lg:h-[50vh]'
        >
          <div className='flex flex-col items-center justify-around w-full max-w-7xl space-y-6 p-4 lg:min-h-96 lg:flex-row'>
            <div className='max-w-prose space-y-6 text-lg font-semibold text-white'>
              <h1 className='text-4xl font-semibold'>
                <span className='text-5xl font-bold'>Event Capture</span>
                <br />
                Never miss the moment.
              </h1>

              <p>
                Capture every moment of an event effortlessly from all angles
                with the help of all your guests.
              </p>

              <ul className='space-y-2'>
                <li>
                  🎉 Effortlessly generate a unique QR code for your event
                </li>
                <li>
                  📸 Invite guests to capture and share their favorite moments
                </li>
                <li>
                  🗂️ Seamlessly collect, organize, and download all shared
                  photos
                </li>
                <li>💕 Preserve every memory with no moment left behind</li>
                <li>💌 Enjoy a hassle-free experience from start to finish</li>
              </ul>
            </div>

            <SignUpForm />
          </div>
        </section>

        <section className=' flex flex-col items-center justify-evenly gap-4 p-4 md:flex-row'>
          <Card className='transition-all md:w-96 md:hover:scale-105'>
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

          <Card className='transition-all md:w-96 md:hover:scale-105'>
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

          <Card className='transition-all md:w-96 md:hover:scale-105'>
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

        <section className=' flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Seamless Event Management with the Dashboard Page
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Easily manage your event&apos;s photos with our intuitive Dashboard
            Page. Organize, review, and download all shared images with just a
            few clicks. Stay in control and ensure only the best memories are
            preserved.
          </p>

          <Card className='mt-4 w-full overflow-hidden bg-muted lg:w-3/4'>
            <img src={pic1} alt='Event Capture Image' />
          </Card>
        </section>

        <section className=' flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Capture every moment effortlessly
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Never miss a moment with Event Capture. Generate a unique QR code,
            share it with your guests, and collect all their photos in one
            place. Relive your event through the eyes of everyone who was there,
            capturing every angle effortlessly.
          </p>

          <div className='mt-4 grid aspect-video w-full grid-cols-3 grid-rows-2 gap-2 lg:w-3/4'>
            <Card className='col-end-2 row-start-1 row-end-3 h-full w-full overflow-hidden'>
              <img
                src={pic2}
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
            <Card className='col-start-2 col-end-4 row-start-1 row-end-2 aspect-video h-full w-full overflow-hidden bg-muted'>
              <img
                src={pic3}
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
            <Card className='col-start-2 col-end-4 row-start-2 row-end-3 aspect-video h-full w-full overflow-hidden bg-muted'>
              <img
                src={pic4}
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
          </div>
        </section>

        <section className=' flex flex-col items-center p-4 text-center'>
          <h2 className='max-w-prose text-3xl font-semibold'>
            Guest-Friendly and Easy to Use
          </h2>

          <p className='max-w-prose text-muted-foreground'>
            Event Capture is designed with your guests in mind. Participating is
            a breeze, no complicated steps, just simple and seamless photo
            sharing. Everyone can contribute effortlessly, ensuring your event
            memories are complete and vibrant.
          </p>

          <Card className='mt-4 w-full overflow-hidden bg-muted lg:w-3/4'>
            <img
              src={pic5}
              alt='Event Capture Image'
              className='w-full object-cover'
            />
          </Card>
        </section>

        {/* <Plans reference /> */}

        <section className=' flex flex-col items-center p-4 text-center'>
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
            <Card className='h-full w-full overflow-hidden'>
              <img
                src={pic6}
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
            <Card className='h-full w-full overflow-hidden'>
              <img
                src={pic7}
                alt='Event Capture Image'
                className='h-full w-full object-cover'
              />
            </Card>
            <Card className='h-full w-full overflow-hidden'>
              <img
                src={pic8}
                alt='Event Capture Image'
                className='h-full object-cover'
              />
            </Card>
          </div>
        </section>
      </main>

      <footer className=' flex flex-col items-center p-4'>
        <p className='text-center text-xs text-muted-foreground'>
          * testimonials generated with ChatGPT during the design phase
        </p>
      </footer>
    </>
  );
}

export default App;
