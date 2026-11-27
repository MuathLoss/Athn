import '@fontsource-variable/cairo';
import '@fontsource-variable/inter';
import '@fontsource/markazi-text/400.css';
import './styles.css';
import './workspace.css';
import './atmosphere.css';
import './marketplace.css';
import './corrections.css';
import './reference-ui.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from 'react-router-dom';
import type { UserRole } from './domain';
import { ServiceError } from './services/contracts';
import { ErrorState, Pending, Shell, Title, useSession } from './ui';
import { Entry, Login } from './public';
import { Activity, Notifications, Overview, VerificationScreen, WorkDetail, Works } from './portal';
import { Confirm, Queue, ReviewCaseScreen, ReviewDecisionScreen } from './review';
import { Marketplace } from './marketplace';
import { developmentFixtures } from './services/runtime';

function RoleGate({ role }: { role: UserRole }) {
  const session = useSession();
  if (session.isPending) return <main className="workspace"><Pending /></main>;
  if (session.isError) return <main className="workspace"><ErrorState error={session.error} retry={() => void session.refetch()} /></main>;
  if (!session.data || session.data.role !== role) return <main className="workspace">
    <Title title="الوصول إلى مساحة العمل" />
    <ErrorState error={new ServiceError(session.data ? 'denied' : 'expired')} />
  </main>;
  return <Outlet />;
}

function Missing() {
  return <><Title title="الصفحة غير متاحة" /><ErrorState error={new ServiceError('missing')} /></>;
}

const developmentRoutes: RouteObject[] = import.meta.env.DEV && developmentFixtures
  ? [{ path: '/_dev', lazy: () => import('./development'), hydrateFallbackElement: <main className="workspace"><Pending /></main> }]
  : [];

const router = createBrowserRouter([
  ...developmentRoutes,
  { path: 'marketplace/pre-publish', element: <Marketplace /> },
  { element: <Shell />, children: [
    { index: true, element: <Entry /> }, { path: 'login', element: <Login /> }, { path: '*', element: <Missing /> },
  ] },
  { element: <RoleGate role="rights_holder" />, children: [{ path: 'portal', element: <Shell area="portal" />, children: [
    { index: true, element: <Overview /> }, { path: 'works', element: <Works /> },
    { path: 'works/:workId', element: <WorkDetail /> }, { path: 'activity', element: <Activity /> },
    { path: 'verifications/:verificationId', element: <VerificationScreen /> },
    { path: 'notifications', element: <Notifications /> },
  ] }] },
  { element: <RoleGate role="reviewer" />, children: [{ path: 'review', element: <Shell area="review" />, children: [
    { index: true, element: <Queue /> }, { path: 'cases/:caseId', element: <ReviewCaseScreen /> },
    { path: 'cases/:caseId/decision', element: <ReviewDecisionScreen /> },
    { path: 'cases/:caseId/confirm', element: <Confirm /> },
  ] }] },
]);

const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 20_000 } } });
createRoot(document.getElementById('root')!).render(
  <StrictMode><QueryClientProvider client={client}><RouterProvider router={router} /></QueryClientProvider></StrictMode>,
);
