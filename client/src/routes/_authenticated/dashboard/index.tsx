import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <>
      <div>Hello "/dashboard"!</div>

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
