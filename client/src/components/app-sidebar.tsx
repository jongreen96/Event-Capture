import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { ImageIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';

export function AppSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <Sidebar variant='sidebar'>
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
