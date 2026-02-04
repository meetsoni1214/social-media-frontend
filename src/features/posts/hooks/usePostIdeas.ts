import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import type {
  SavedPostIdea,
  SavePostIdeaRequest,
  PostIdeasResponse,
  PostIdeaType,
} from '@/features/posts/types/post';

interface PostIdeasParams {
  businessProfile: BusinessProfileFormData;
}

const POST_IDEAS_BASE_KEY = ['post-ideas'] as const;
const POST_IDEAS_SAVED_BASE_KEY = [...POST_IDEAS_BASE_KEY, 'saved'] as const;

const POST_IDEAS_KEYS = {
  all: POST_IDEAS_BASE_KEY,
  saved: (ideaType: PostIdeaType) =>
    [...POST_IDEAS_SAVED_BASE_KEY, ideaType] as const,
  generatedPromotion: (params: PostIdeasParams) =>
    [...POST_IDEAS_BASE_KEY, 'generated', 'promotion', params] as const,
  generatedEducational: (params: PostIdeasParams) =>
    [...POST_IDEAS_BASE_KEY, 'generated', 'educational', params] as const,
};

export function useGetSavedPostIdeas(ideaType: PostIdeaType) {
  return useQuery<SavedPostIdea[]>({
    queryKey: POST_IDEAS_KEYS.saved(ideaType),
    queryFn: () => postService.listSavedPostIdeas(ideaType),
    enabled: true,
  });
}

export function useGenerateProductPromotionIdeas() {
  return useMutation<PostIdeasResponse, Error, PostIdeasParams>({
    mutationFn: params =>
      postService.generatePromotionIdeas(params.businessProfile),
  });
}

export function useGenerateEducationalContentIdeas() {
  return useMutation<PostIdeasResponse, Error, PostIdeasParams>({
    mutationFn: params =>
      postService.generateEducationalIdeas(params.businessProfile),
  });
}

export function useSavePostIdea() {
  const queryClient = useQueryClient();

  return useMutation<SavedPostIdea, Error, SavePostIdeaRequest>({
    mutationFn: payload => postService.savePostIdea(payload),
    onSuccess: data => {
      queryClient.setQueryData(
        POST_IDEAS_KEYS.saved(data.ideaType),
        (existing: SavedPostIdea[] = []) => {
          return [data, ...existing];
        }
      );
    },
  });
}
