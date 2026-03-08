export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface InsufficientCreditsDetail {
  message: string;
  requiredCredits: number;
  availableCredits: number;
  action: 'POST_IDEAS_GENERATION' | 'POST_GENERATION';
}

export class InsufficientCreditsError extends ApiError {
  constructor(
    message: string,
    public detail: InsufficientCreditsDetail,
    status = 402
  ) {
    super(message, status, 'INSUFFICIENT_CREDITS');
    this.name = 'InsufficientCreditsError';
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}

class AuthenticationError extends ApiError {
  constructor(message: string, status?: number) {
    super(message, status, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

class ValidationError extends ApiError {
  constructor(message: string, status?: number) {
    super(message, status, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, undefined, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

function isInsufficientCreditsDetail(
  detail: unknown
): detail is InsufficientCreditsDetail {
  if (!detail || typeof detail !== 'object') {
    return false;
  }

  const candidate = detail as Record<string, unknown>;

  return (
    typeof candidate.message === 'string' &&
    typeof candidate.requiredCredits === 'number' &&
    typeof candidate.availableCredits === 'number' &&
    typeof candidate.action === 'string'
  );
}

export function createApiError(
  response: Response,
  errorMessage: string,
  errorData?: unknown
): ApiError {
  const status = response.status;
  const detail =
    errorData && typeof errorData === 'object'
      ? (errorData as Record<string, unknown>).detail
      : undefined;

  if (status === 402 && isInsufficientCreditsDetail(detail)) {
    return new InsufficientCreditsError(detail.message || errorMessage, detail);
  }

  if (status === 401 || status === 403) {
    return new AuthenticationError(errorMessage, status);
  }

  if (status === 404) {
    return new NotFoundError(errorMessage);
  }

  if (status === 400 || status === 422) {
    return new ValidationError(errorMessage, status);
  }

  return new ApiError(errorMessage, status);
}
