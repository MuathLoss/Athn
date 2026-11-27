import { createMockServices } from './mock';
import { createPortalHttpServices } from './portal-http';

const base = import.meta.env.VITE_IDHN_API_BASE_URL;
export const developmentFixtures = import.meta.env.DEV && !base;
export const services = developmentFixtures
  ? createMockServices()
  : createPortalHttpServices(base, import.meta.env.VITE_IDHN_API_ROUTES);
