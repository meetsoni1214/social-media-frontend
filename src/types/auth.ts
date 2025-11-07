export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  isVerified: boolean;
  phoneVerified: boolean;
  email?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestOTPResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyOTPResponse {
  message: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}
