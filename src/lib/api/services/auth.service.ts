import type {
  RegisterResponse,
  RequestOTPResponse,
  VerifyOTPResponse,
} from '@/features/auth/types/auth';
import type { SignupFormData } from '@/lib/utils/validation';
import {
  clearLoginAttemptInfo,
  consumeCode,
  createCode,
  resendCode,
} from 'supertokens-web-js/recipe/passwordless';
import { httpClient } from '../core/http-client';

function formatPhoneNumber(phone: string): string {
  return `+91${phone}`;
}

async function sendOTP(phone: string): Promise<RequestOTPResponse> {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    const response = await createCode({
      phoneNumber: formattedPhone,
    });

    if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
      throw new Error(response.reason || 'Sign up not allowed');
    }

    return {
      success: true,
      message: 'OTP sent successfully to your phone',
    };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : 'Failed to send OTP. Please try again.'
    );
  }
}

async function resendOTP(): Promise<RequestOTPResponse> {
  try {
    const response = await resendCode();

    if (response.status === 'RESTART_FLOW_ERROR') {
      await clearLoginAttemptInfo();
      throw new Error('Session expired. Please start again.');
    }

    return {
      success: true,
      message: 'OTP resent successfully',
    };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : 'Failed to resend OTP. Please try again.'
    );
  }
}

async function verifyOTP(otp: string): Promise<VerifyOTPResponse> {
  try {
    const response = await consumeCode({
      userInputCode: otp,
    });

    if (response.status === 'OK') {
      await clearLoginAttemptInfo();

      const isNewUser =
        response.createdNewRecipeUser &&
        response.user.loginMethods.length === 1;

      return {
        success: true,
        isNewUser,
        userId: response.user.id,
        message: isNewUser
          ? 'Account created successfully'
          : 'Login successful',
      };
    } else if (response.status === 'INCORRECT_USER_INPUT_CODE_ERROR') {
      const attemptsLeft =
        response.maximumCodeInputAttempts -
        response.failedCodeInputAttemptCount;
      throw new Error(
        `Incorrect OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
      );
    } else if (response.status === 'EXPIRED_USER_INPUT_CODE_ERROR') {
      throw new Error('OTP has expired. Please request a new one.');
    } else if (response.status === 'RESTART_FLOW_ERROR') {
      await clearLoginAttemptInfo();
      throw new Error('Too many incorrect attempts. Please start again.');
    } else if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
      await clearLoginAttemptInfo();
      throw new Error(response.reason || 'Sign in not allowed');
    }

    throw new Error('Unexpected error occurred');
  } catch (err: unknown) {
    throw err instanceof Error ? err : new Error('Unexpected error occurred');
  }
}

async function register(signupData: SignupFormData): Promise<RegisterResponse> {
  return httpClient.post<RegisterResponse>('/auth/register', signupData);
}

export const authService = {
  sendOTP,
  resendOTP,
  verifyOTP,
  register,
};
