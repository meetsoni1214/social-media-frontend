import type {
  BusinessProfileFormData,
  ContentPreferencesFormData,
} from "./validations";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OnboardingData {
  businessProfile: BusinessProfileFormData;
  contentPreferences: ContentPreferencesFormData;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async saveBusinessProfile(
    data: BusinessProfileFormData
  ): Promise<ApiResponse<{ id: string }>> {
    await delay(800);

    console.log("Mock API: Saving business profile", data);

    return {
      success: true,
      data: { id: `profile_${Date.now()}` },
    };
  },

  async saveContentPreferences(
    data: ContentPreferencesFormData
  ): Promise<ApiResponse<{ id: string }>> {
    await delay(800);

    console.log("Mock API: Saving content preferences", data);

    return {
      success: true,
      data: { id: `preferences_${Date.now()}` },
    };
  },

  async completeOnboarding(
    data: OnboardingData
  ): Promise<ApiResponse<{ redirectUrl: string }>> {
    await delay(1000);

    console.log("Mock API: Completing onboarding", data);

    return {
      success: true,
      data: { redirectUrl: "/dashboard" },
    };
  },
};
