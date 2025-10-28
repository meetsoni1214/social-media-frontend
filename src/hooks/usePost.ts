import { apiClient, PostIdea } from '@/lib/api';
import {
  BusinessProfileFormData,
  ContentPreferencesFormData,
} from '@/lib/validations';
import { useQuery } from '@tanstack/react-query';

interface PostParams {
  businessProfile: BusinessProfileFormData;
  contentPreferences: ContentPreferencesFormData;
  postIdea: PostIdea;
}

export function usePosts(params: PostParams) {
  return useQuery({
    queryKey: ['post', params],
    queryFn: () =>
      apiClient.generatePost(
        params.businessProfile,
        params.contentPreferences,
        params.postIdea
      ),
    enabled:
      !!params.businessProfile &&
      !!params.contentPreferences &&
      !!params.postIdea,
  });
}
