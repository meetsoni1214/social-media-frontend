import { keysToCamel, keysToSnake } from '@/lib/utils/format';
import { API_BASE_URL, DEFAULT_REQUEST_OPTIONS } from './config';
import { createApiError, NetworkError } from './errors';

interface RequestOptions extends RequestInit {
  skipTransform?: boolean;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      options,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      options,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data,
      options,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      data,
      options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      endpoint,
      options,
    });
  }

  private async request<T>(config: {
    method: string;
    endpoint: string;
    data?: unknown;
    options?: RequestOptions;
  }): Promise<T> {
    const { method, endpoint, data, options = {} } = config;
    const { skipTransform, ...fetchOptions } = options;

    const url = `${this.baseURL}${endpoint}`;

    try {
      const requestBody = data
        ? JSON.stringify(skipTransform ? data : keysToSnake(data))
        : undefined;

      const response = await fetch(url, {
        ...DEFAULT_REQUEST_OPTIONS,
        ...fetchOptions,
        method,
        body: requestBody,
      });

      return await this.handleResponse<T>(response, skipTransform);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'TypeError') {
        throw new NetworkError(
          'Network request failed. Please check your connection.'
        );
      }
      throw err;
    }
  }

  private async handleResponse<T>(
    response: Response,
    skipTransform?: boolean
  ): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error (${response.status}): ${response.statusText}`;
      }

      throw createApiError(response, errorMessage);
    }

    const data = await response.json();
    return skipTransform ? data : keysToCamel<T>(data);
  }
}

export const httpClient = new HttpClient(API_BASE_URL);
