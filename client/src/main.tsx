import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import DemoStore from './routes/demo.store'
import DemoTanstackQuery from './routes/demo.tanstack-query'

import Header from './components/Header'

import TanstackQueryLayout from './integrations/tanstack-query/layout'

import TanstackQueryProvider from './integrations/tanstack-query/provider'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <TanstackQueryProvider>
        <Header />
        <Outlet />
        <TanStackRouterDevtools />

        <TanstackQueryLayout />
      </TanstackQueryProvider>
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  DemoStore(rootRoute),
  DemoTanstackQuery(rootRoute),
])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
