import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { Link, useMatchRoute } from '@tanstack/react-router';
import {
  ChevronUpIcon,
  FileBarChart2Icon,
  ImageIcon,
  LayoutDashboardIcon,
  PlusIcon,
  UserIcon,
} from 'lucide-react';
import type { Plan } from '../../../src/utils/types';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

async function getPlans(): Promise<Plan[]> {
  const plans = await fetch('/api/plan').then((res) => res.json());
  return plans;
}

export function AppSidebar() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const matchRoute = useMatchRoute();

  if (isLoading) {
    return (
      <Sidebar>
        <SidebarHeader className='flex flex-row items-center justify-between'>
          <p className='select-none font-semibold text-2xl'>Event Capture</p>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent className='flex gap-2 text-center p-2'>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <Skeleton className='w-full h-7 rounded-lg' />
          <Skeleton className='w-full h-7 rounded-lg' />
          <Skeleton className='w-full h-7 rounded-lg' />
        </SidebarContent>

        <SidebarFooter>
          <Skeleton className='w-full h-7 rounded-lg' />
        </SidebarFooter>
      </Sidebar>
    );
  }

  if (isError) {
    return (
      <Sidebar>
        <SidebarHeader className='flex flex-row items-center justify-between'>
          <p className='select-none font-semibold text-2xl'>Event Capture</p>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent className='flex items-center justify-center text-center p-2'>
          <p>Error loading data, please refresh the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </SidebarContent>
      </Sidebar>
    );
  }

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

      <SidebarFooter>
        <SidebarGroup className='p-0'>
          <SidebarGroupLabel>Plans</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <FileBarChart2Icon />
                    Event name
                    {/* TODO: Add logic to display selected plan name here */}
                    <ChevronUpIcon className='ml-auto' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='top' className='w-[239px]'>
                  <DropdownMenuItem asChild>
                    <Link to='/plans'>
                      <p>Create new plan</p>
                      <PlusIcon className='ml-auto' />
                    </Link>
                  </DropdownMenuItem>
                  <Separator className='my-1' />
                  {data!.map((plan: Plan) => (
                    <DropdownMenuItem key={plan.id}>
                      {plan.eventname}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
