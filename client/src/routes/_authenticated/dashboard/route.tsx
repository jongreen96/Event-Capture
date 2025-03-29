import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <App />
    </SidebarProvider>
  );
}

function App() {
  const { state, openMobile } = useSidebar();
  const { user } = Route.useRouteContext();
  return (
    <>
      <AppSidebar user={user} />
      <SidebarTrigger
        className={cn(
          'fixed top-2 left-2',
          state === 'expanded' && openMobile && 'hidden'
        )}
      />
      <main className='w-full max-w-7xl mx-auto p-4 pt-18 @container flex flex-col gap-10'>
        <Outlet />
      </main>
    </>
  );
}
