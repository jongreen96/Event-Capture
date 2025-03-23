import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full p-4 pt-18 @container flex flex-col gap-10'>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
