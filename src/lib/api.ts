import type { BusinessProfileFormData, SignupFormData } from './validations';
import type {
  RegisterResponse,
  RequestOTPResponse,
  VerifyOTPResponse,
} from '@/types/auth';
import type { BusinessProfileResponse } from '@/types/businessProfile';
import { keysToCamel, keysToSnake } from './utils';

import {
  clearLoginAttemptInfo,
  consumeCode,
  createCode,
  resendCode,
} from 'supertokens-web-js/recipe/passwordless';
import {
  SocialProfileConnectRequest,
  SocialProfileConnectResponse,
  SocialProfileCreateResponse,
  SocialAccount,
  SocialAccountsStatusResponse,
} from '@/types/socialProfile';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface PostIdea {
  id: string;
  title: string;
  content: string;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface PostIdeasResponse {
  success: boolean;
  data: PostIdea[];
}

interface GeneratedPost {
  id: string;
  base64Image: string;
}

interface GeneratedPostResponse {
  success: boolean;
  data: GeneratedPost;
}

class ApiClient {
  private formatPhoneNumber(phone: string): string {
    return `+91${phone}`;
  }

  async sendOTP(phone: string): Promise<RequestOTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);

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

  async resendOTP(): Promise<RequestOTPResponse> {
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

  async verifyOTP(otp: string): Promise<VerifyOTPResponse> {
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

  async generateProductPromotionIdeas(
    businessProfile: BusinessProfileFormData
  ) {
    const url = `${API_BASE_URL}/post-ideas/promotion`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(
        keysToSnake({
          businessProfile,
        })
      ),
    });

    return this.handleResponse<PostIdeasResponse>(response);
  }

  async generateEducationalContentIdeas(
    businessProfile: BusinessProfileFormData
  ) {
    const url = `${API_BASE_URL}/post-ideas/educational`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(
        keysToSnake({
          businessProfile,
        })
      ),
    });

    return this.handleResponse<PostIdeasResponse>(response);
  }

  async generatePost(
    businessProfile: BusinessProfileFormData,
    postIdea: PostIdea
  ) {
    const url = `${API_BASE_URL}/posts/generate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(
        keysToSnake({
          businessProfile,
          postIdea,
        })
      ),
    });

    return this.handleResponse<GeneratedPostResponse>(response);
  }

  async register(signupData: SignupFormData): Promise<RegisterResponse> {
    const url = `${API_BASE_URL}/auth/register`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(keysToSnake(signupData)),
    });

    return this.handleResponse<RegisterResponse>(response);
  }

  async saveBusinessProfile(
    businessProfile: BusinessProfileFormData
  ): Promise<BusinessProfileResponse> {
    const url = `${API_BASE_URL}/business-profiles`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(keysToSnake(businessProfile)),
    });

    return this.handleResponse<BusinessProfileResponse>(response);
  }

  async getBusinessProfile(): Promise<BusinessProfileResponse[]> {
    const url = `${API_BASE_URL}/business-profiles`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 404) {
      return [];
    }

    return this.handleResponse<BusinessProfileResponse[]>(response);
  }

  async createSocialProfile(): Promise<SocialProfileCreateResponse> {
    const url = `${API_BASE_URL}/social-profiles`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return this.handleResponse<SocialProfileCreateResponse>(response);
  }

  async connectSocialProfile(
    request: SocialProfileConnectRequest
  ): Promise<SocialProfileConnectResponse> {
    const url = `${API_BASE_URL}/social-profiles/connect/${request.platform}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return this.handleResponse<SocialProfileConnectResponse>(response);
  }

  async getSocialAccounts(): Promise<SocialAccountsStatusResponse> {
    const url = `${API_BASE_URL}/social-profiles/accounts`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const accounts = await this.handleResponse<SocialAccount[]>(response);

    const statusResponse: SocialAccountsStatusResponse = {
      facebook: { isConnected: false },
      instagram: { isConnected: false },
      googlebusiness: { isConnected: false },
    };

    accounts.forEach(account => {
      if (account.platform in statusResponse) {
        statusResponse[account.platform] = {
          isConnected: account.connected,
          accountId: account.fieldId,
          username: account.username,
          displayName: account.displayName,
          profileImageUrl: account.profileImageUrl,
        };
      }
    });

    return statusResponse;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error (${response.status}): ${response.statusText}`;
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };

      throw error;
    }

    const data = await response.json();
    return keysToCamel<T>(data);
  }
}

export const apiClient = new ApiClient();
