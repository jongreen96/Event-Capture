import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { ImageIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';

export function AppSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <Sidebar variant='sidebar'>
      <SidebarHeader className='flex flex-row items-center justify-between'>
        <p className='select-none font-semibold text-2xl'>Event Capture</p>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={Boolean(matchRoute({ to: '/dashboard' }))}
                >
                  <Link to='/dashboard'>
                    <LayoutDashboardIcon />
                    Overview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={Boolean(matchRoute({ to: '/dashboard/photos' }))}
                >
                  <Link to='/dashboard/photos'>
                    <ImageIcon />
                    Photos
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>0</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={Boolean(matchRoute({ to: '/dashboard/guests' }))}
                >
                  <Link to='/dashboard/guests'>
                    <UserIcon />
                    Guests
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>0</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
