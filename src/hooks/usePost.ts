import { apiClient, PostIdea } from '@/lib/api';
import { BusinessProfileFormData } from '@/lib/validations';
import { useQuery } from '@tanstack/react-query';

interface PostParams {
  businessProfile: BusinessProfileFormData;
  postIdea: PostIdea;
}

export function usePosts(params: PostParams) {
  return useQuery({
    queryKey: ['post', params],
    queryFn: () =>
      apiClient.generatePost(params.businessProfile, params.postIdea),
    enabled: !!params.businessProfile && !!params.postIdea,
  });
}
