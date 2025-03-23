import { createRootRoute, Outlet } from '@tanstack/react-router';

import TanstackQueryLayout from '../integrations/tanstack-query/layout';

import TanstackQueryProvider from '../integrations/tanstack-query/provider';

export const Route = createRootRoute({
  component: () => (
    <>
      <TanstackQueryProvider>
        <Outlet />

        <TanstackQueryLayout />
      </TanstackQueryProvider>
    </>
  ),
});
