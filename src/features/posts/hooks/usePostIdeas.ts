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
  ideaType: PostIdeaType;
}

const POST_IDEAS_KEYS = {
  saved: (ideaType: PostIdeaType) => ['post-ideas', 'saved', ideaType] as const,
};

export function useGetSavedPostIdeas(ideaType: PostIdeaType) {
  return useQuery<SavedPostIdea[]>({
    queryKey: POST_IDEAS_KEYS.saved(ideaType),
    queryFn: () => postService.listSavedPostIdeas(ideaType),
    enabled: true,
  });
}

export function useGeneratePostIdeas() {
  return useMutation<PostIdeasResponse, Error, PostIdeasParams>({
    mutationFn: params =>
      postService.generatePostIdeas(params.businessProfile, params.ideaType),
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
