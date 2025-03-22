import { Button, buttonVariants } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <>
      <div>Hello "/dashboard"!</div>

      <Link to='/dashboard/summary' className={buttonVariants()}>
        Go to Summary
      </Link>

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
