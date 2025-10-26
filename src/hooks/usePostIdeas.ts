import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  BusinessProfileFormData,
  ContentPreferencesFormData,
} from '@/lib/validations';

interface PostIdeasParams {
  businessProfile: BusinessProfileFormData;
  contentPreferences: ContentPreferencesFormData;
}

const POST_IDEAS_KEYS = {
  all: ['post-ideas'] as const,
  promotion: (params: PostIdeasParams) =>
    [...POST_IDEAS_KEYS.all, 'promotion', params] as const,
  educational: (params: PostIdeasParams) =>
    [...POST_IDEAS_KEYS.all, 'educational', params] as const,
};

export function useProductPromotionIdeas(params: PostIdeasParams) {
  return useQuery({
    queryKey: POST_IDEAS_KEYS.promotion(params),
    queryFn: () =>
      apiClient.generateProductPromotionIdeas(
        params.businessProfile,
        params.contentPreferences
      ),
    enabled: !!params.businessProfile && !!params.contentPreferences,
  });
}

export function useEducationalContentIdeas(params: PostIdeasParams) {
  return useQuery({
    queryKey: POST_IDEAS_KEYS.educational(params),
    queryFn: () =>
      apiClient.generateEducationalContentIdeas(
        params.businessProfile,
        params.contentPreferences
      ),
    enabled: !!params.businessProfile && !!params.contentPreferences,
  });
}
