import { ServiceError } from './contracts';

// Paths and payload decoders will be supplied by the production integration.
// The marketplace analyzer is a separate demo boundary, not a portal endpoint.
export function createHttpClient(baseUrl: URL, fetcher: typeof fetch = fetch) {
  return async function request<T>(path: string, decode: (body: unknown) => T, init?: RequestInit): Promise<T> {
    const url = new URL(path, baseUrl);
    if (url.origin !== baseUrl.origin) throw new ServiceError('invalid');
    const response = await fetcher(url, { ...init, credentials: 'include' });
    if (response.status === 401) throw new ServiceError('expired');
    if (response.status === 403) throw new ServiceError('denied');
    if (response.status === 404) throw new ServiceError('missing');
    if (response.status === 409) throw new ServiceError('conflict');
    if (!response.ok) throw new ServiceError('unavailable');
    return decode(response.status === 204 ? undefined : await response.json());
  };
}
