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

export class AuthenticationError extends ApiError {
  constructor(message: string, status?: number) {
    super(message, status, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class ValidationError extends ApiError {
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

export function createApiError(
  response: Response,
  errorMessage: string
): ApiError {
  const status = response.status;

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
