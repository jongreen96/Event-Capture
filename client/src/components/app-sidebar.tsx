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
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { signOut } from '@/lib/auth-client';
import { getPlans } from '@/lib/queries';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useQuery } from '@tanstack/react-query';
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router';
import {
  ChevronUpIcon,
  FileBarChart2Icon,
  ImageIcon,
  LayoutDashboardIcon,
  PlusIcon,
  UserIcon,
} from 'lucide-react';
import { useContext, useEffect } from 'react';
import type { Plan, User } from '../../../src/utils/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

export function AppSidebar({ user }: { user: User }) {
  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });

  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const { activePlanId, setActivePlanId } = useContext(
    PlanContext
  ) as PlanContextType;

  useEffect(() => {
    if (!activePlanId && plans.data?.length) {
      setActivePlanId(plans.data[0].id);
    }
  }, [activePlanId, plans.data, setActivePlanId]);

  const plan = plans.data?.find((plan) => plan.id === activePlanId);

  if (plans.isLoading) {
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

  if (plans.isError) {
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
    <Sidebar variant='sidebar' className='select-none overflow-hidden z-50'>
      <SidebarHeader className='flex flex-row items-center justify-between'>
        <p className='font-semibold text-2xl'>Event Capture</p>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarSeparator className='ml-0' />

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
                <SidebarMenuBadge>{plan?.images.length}</SidebarMenuBadge>
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
                <SidebarMenuBadge>{plan?.guests.length}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className='ml-0' />

      <SidebarFooter className='p-0'>
        <SidebarGroup>
          <SidebarGroupLabel>Plans</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <FileBarChart2Icon />
                    <p className='truncate'>
                      {plan?.eventname || 'Select a plan'}
                    </p>
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
                  {plans.data!.map((plan: Plan) => (
                    <DropdownMenuItem
                      key={plan.id}
                      onClick={() => setActivePlanId(plan.id)}
                    >
                      {plan.eventname}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className='ml-0' />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full'>
                      <Avatar className='rounded-sm'>
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>

                      <div className='text-left -space-y-1 overflow-hidden'>
                        <p>{user.name}</p>
                        <p className='text-xs text-gray-500 truncate'>
                          {user.email}
                        </p>
                      </div>
                      <ChevronUpIcon className='ml-auto size-4' />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='w-[239px]'>
                  <DropdownMenuItem
                    onClick={async () =>
                      await signOut({
                        fetchOptions: {
                          onSuccess: async () => {
                            navigate({ to: '/' });
                          },
                        },
                      })
                    }
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
