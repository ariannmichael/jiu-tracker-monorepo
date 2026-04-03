import { createLogger, serializeError } from '@/services/logger';

const apiLogger = createLogger('api');

type ApiRequestOptions = {
  operation?: string;
};

function toHeaderEntries(headers?: HeadersInit): [string, string][] {
  if (!headers) {
    return [];
  }

  if (headers instanceof Headers) {
    return Array.from(headers.entries());
  }

  if (Array.isArray(headers)) {
    return headers;
  }

  return Object.entries(headers);
}

function hasHeader(headers: HeadersInit | undefined, key: string): boolean {
  return toHeaderEntries(headers).some(
    ([name]) => name.toLowerCase() === key.toLowerCase(),
  );
}

function toPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export default class Api {
  static BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'JiuTrackerPremium';

  static url(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${Api.BASE_URL}${normalizedPath}`;
  }

  static authHeaders(token: string | null): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request(
    path: string,
    init: RequestInit = {},
    options: ApiRequestOptions = {},
  ): Promise<Response> {
    const method = (init.method ?? 'GET').toUpperCase();
    const url = Api.url(path);
    const startedAt = Date.now();
    const requestLogger = apiLogger.child({
      operation: options.operation ?? path,
      method,
      path: toPath(url),
      hasAuthHeader: hasHeader(init.headers, 'authorization'),
    });

    requestLogger.debug('API request started');

    try {
      const response = await fetch(url, init);
      const durationMs = Date.now() - startedAt;

      if (response.ok) {
        requestLogger.info(
          { status: response.status, durationMs },
          'API request completed',
        );
      } else {
        requestLogger.warn(
          { status: response.status, durationMs },
          'API request returned non-success status',
        );
      }

      return response;
    } catch (error) {
      requestLogger.error(
        { err: serializeError(error), durationMs: Date.now() - startedAt },
        'API request failed',
      );
      throw error;
    }
  }
}
