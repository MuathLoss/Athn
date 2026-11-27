import type { User } from '../domain';
import { ServiceError, type Services } from './contracts';
import { createHttpClient } from './http';

type Operation = 'session' | 'signIn' | 'signOut' | 'overview' | 'works' | 'work' | 'activity' | 'verification'
  | 'notifications' | 'markAsRead' | 'reviewQueue' | 'reviewCase' | 'prepareDecision' | 'submitDecision';
type Endpoint = { path: string; method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' };
type Routes = Partial<Record<Operation, Endpoint>>;

function decodeSession(data: unknown): User | null {
  if (data === null) return null;
  if (typeof data !== 'object' || !('id' in data) || !('name' in data) || !('role' in data)
    || typeof data.id !== 'string' || typeof data.name !== 'string'
    || (data.role !== 'rights_holder' && data.role !== 'reviewer' && data.role !== 'seller')) throw new ServiceError('unavailable');
  return { id: data.id, name: data.name, role: data.role };
}

function parseRoutes(value?: string): Routes {
  try {
    const parsed: unknown = value ? JSON.parse(value) : {};
    return parsed && typeof parsed === 'object' ? parsed as Routes : {};
  } catch {
    return {};
  }
}

export function createPortalHttpServices(base?: string, mapping?: string): Services {
  const routes = parseRoutes(mapping);
  const baseUrl = base ? new URL(base, location.origin) : undefined;
  const request = baseUrl ? createHttpClient(baseUrl) : undefined;

  async function call<T>(operation: Operation, params: Record<string, string | undefined> = {}, input?: unknown, decode?: (body: unknown) => T): Promise<T> {
    const endpoint = routes[operation];
    if (!request || !baseUrl || typeof endpoint?.path !== 'string') throw new ServiceError('unavailable');
    const pathParams = new Set<string>();
    const path = endpoint.path.replace(/\{(\w+)\}/g, (_, key: string) => {
      const value = params[key];
      if (value == null) throw new ServiceError('missing');
      pathParams.add(key);
      return encodeURIComponent(value);
    });
    const url = new URL(path, baseUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value && !pathParams.has(key)) url.searchParams.set(key, value);
    }
    return request(url.href, decode ?? (body => body as T), {
      method: endpoint.method ?? (input === undefined ? 'GET' : 'POST'),
      headers: input === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: input === undefined ? undefined : JSON.stringify(input),
    });
  }

  return {
    auth: {
      async getCurrentUser() {
        if (!routes.session) return null;
        try {
          return await call('session', {}, undefined, decodeSession);
        } catch (error) {
          if (error instanceof ServiceError && error.kind === 'expired') return null;
          throw error;
        }
      },
      async signIn(credentials) {
        try {
          await call('signIn', {}, credentials, () => undefined);
        } catch (error) {
          if (error instanceof ServiceError && error.kind === 'expired') throw new ServiceError('invalid_credentials');
          throw error;
        }
        const session = await call('session', {}, undefined, decodeSession);
        if (!session) throw new ServiceError('unavailable');
        return session;
      },
      signOut: () => call('signOut', {}, {}, () => undefined),
    },
    rights: {
      getOverview: () => call('overview'),
      getProtectedWorks: filters => call('works', { ...filters }),
      getWork: id => call('work', { id }),
      getUsageActivity: filters => call('activity', { ...filters }),
    },
    verification: { getVerification: id => call('verification', { id }) },
    notification: {
      getNotifications: () => call('notifications'),
      markAsRead: id => call('markAsRead', { id }, {}, () => undefined),
    },
    review: {
      getQueue: filters => call('reviewQueue', { ...filters }),
      getCase: id => call('reviewCase', { id }),
      prepareDecision: (id, input) => call('prepareDecision', { id }, input),
      submitDecision: (id, input, expectedRevision) => call('submitDecision', { id }, { ...input, expectedRevision }),
    },
  };
}
