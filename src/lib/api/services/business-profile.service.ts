import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import { httpClient } from '../core/http-client';
import { NotFoundError } from '../core/errors';

async function getProfiles(): Promise<BusinessProfileResponse[]> {
  try {
    return await httpClient.get<BusinessProfileResponse[]>(
      '/business-profiles'
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return [];
    }
    throw error;
  }
}

async function createProfile(
  businessProfile: BusinessProfileFormData
): Promise<BusinessProfileResponse> {
  return httpClient.post<BusinessProfileResponse>(
    '/business-profiles',
    businessProfile
  );
}

export const businessProfileService = {
  getProfiles,
  createProfile,
};
