import { useQuery } from '@tanstack/react-query';
import { postService } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/utils/validation';

interface PostIdeasParams {
  businessProfile: BusinessProfileFormData;
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
    queryFn: () => postService.generatePromotionIdeas(params.businessProfile),
    enabled: !!params.businessProfile,
  });
}

export function useEducationalContentIdeas(params: PostIdeasParams) {
  return useQuery({
    queryKey: POST_IDEAS_KEYS.educational(params),
    queryFn: () => postService.generateEducationalIdeas(params.businessProfile),
    enabled: !!params.businessProfile,
  });
}
