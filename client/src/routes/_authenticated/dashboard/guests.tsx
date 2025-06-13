import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPlans } from '@/lib/queries';
import { PlanContext, type PlanContextType } from '@/routes/_authenticated';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useContext, useState } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/guests')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activePlanId } = useContext(PlanContext) as PlanContextType;
  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: Infinity,
  });
  const plan = plans.data?.find((plan) => plan.id === activePlanId);
  const [sortBy, setSortBy] = useState<'usage' | 'name' | 'photos'>('name');

  const guests = plan
    ? plan.guests
        .map((guest: string) => ({
          guest,
          images: plan.images.filter((image) => image.guestname === guest),
          usage: plan.images
            .filter((image) => image.guestname === guest)
            .reduce((acc, image) => acc + image.imagesize, 0),
        }))
        .sort((a, b) => {
          if (sortBy === 'usage') return b.usage - a.usage;
          if (sortBy === 'name') return a.guest.localeCompare(b.guest);
          if (sortBy === 'photos') return b.images.length - a.images.length;
          return 0;
        })
    : [];

  return (
    <Card className='shadow-none border-0 @container'>
      <CardHeader className='space-y-2 px-0'>
        <Link
          to='/dashboard'
          className={buttonVariants({
            variant: 'ghost',
            className: 'w-fit -mt-14 -ml-4 text-muted-foreground',
          })}
        >
          <ChevronLeft />
          Overview
        </Link>
        <div className='flex items-center justify-between'>
          <CardTitle>All Guests</CardTitle>

          <div className='flex items-center gap-2'>
            Sort by:
            <Select
              defaultValue={sortBy}
              onValueChange={(value) =>
                setSortBy(value as 'usage' | 'name' | 'photos')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='usage'>Usage</SelectItem>
                <SelectItem value='name'>Name</SelectItem>
                <SelectItem value='photos'>Photos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        {!activePlanId ? (
          <p>Error loading plans.</p>
        ) : !plan ? (
          <p>Select a plan from the sidebar.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className='hidden lg:table-cell'>Previews</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <CustomTableRow guest={guest} key={guest.guest} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function CustomTableRow({
  guest,
}: {
  guest: {
    guest: string;
    images: {
      id: string;
      planid: string;
      guestname: string;
      imagename: string;
      imagesize: number;
      createdat: Date;
    }[];
    usage: number;
  };
}) {
  const [showImages, setShowImages] = useState(false);

  return (
    <>
      <TableRow key={guest.guest}>
        <TableCell>{guest.guest}</TableCell>
        <TableCell>{guest.images.length}</TableCell>
        <TableCell>
          {guest.usage > 0 ? `${(guest.usage / 1024).toFixed(2)} MB` : '0 MB'}
        </TableCell>
        <TableCell className='hidden lg:table-cell'>
          <div className='flex items-center gap-1'>
            {guest.images.slice(0, 10).map((img, idx) => (
              <img
                key={img.id}
                src={`https://images.jongreen.dev/${img.imagename}-preview`}
                alt={img.guestname}
                className='w-8 h-8 object-cover rounded shadow-sm'
                style={{ zIndex: 10 - idx }}
              />
            ))}
          </div>
        </TableCell>
        <TableCell className='text-right'>
          <Button
            variant='outline'
            onClick={() => setShowImages(!showImages)}
            className='w-min'
          >
            {showImages ? 'Hide' : 'Show'} Images
          </Button>
        </TableCell>
      </TableRow>

      {showImages && guest.images.length > 0 && (
        <TableRow>
          <TableCell colSpan={5}>
            <CardContent className='grid px-0 gap-2 grid-cols-3 @2xs:grid-cols-4 @sm:grid-cols-5 @xl:grid-cols-6 @2xl:grid-cols-8'>
              {guest.images.map((image) => (
                <Link
                  to={`/dashboard/photos/$photoId`}
                  params={{ photoId: image.id }}
                  key={image.id}
                >
                  <Card className='p-0 overflow-hidden aspect-square'>
                    <img
                      src={`https://images.jongreen.dev/${image.imagename}-preview`}
                      alt={image.imagename}
                      className='size-full object-cover object-center'
                    />
                  </Card>
                </Link>
              ))}
            </CardContent>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
