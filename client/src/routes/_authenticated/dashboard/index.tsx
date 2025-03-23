import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from '@/lib/auth-client';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ChartColumnIcon,
  FileQuestionIcon,
  ImageIcon,
  UserIcon,
} from 'lucide-react';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <>
      <section className='grid grid-cols-2 @3xl:grid-cols-4 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ImageIcon className='size-4' />
              Photos
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserIcon className='size-4' />
              Guests
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ChartColumnIcon className='size-4' />
              Usage
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileQuestionIcon className='size-4' />
              Unknown
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Button
        onClick={async () =>
          await signOut({
            fetchOptions: {
              onSuccess: async () => {
                navigate({ to: '/' });
              },
            },
          })
        }
        className='ml-2'
      >
        Sign Out
      </Button>
    </>
  );
}
