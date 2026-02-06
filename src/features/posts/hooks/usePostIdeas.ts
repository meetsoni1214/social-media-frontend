import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import type {
  SavedPostIdea,
  SavePostIdeaRequest,
  UpdatePostIdeaRequest,
  PostIdeasResponse,
  PostIdeaType,
} from '@/features/posts/types/post';
import { normalizeIdeaCount } from '@/features/posts/utils/ideaCount';

interface PostIdeasParams {
  businessProfile: BusinessProfileFormData;
  ideaType: PostIdeaType;
  ideaCount?: number;
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
      postService.generatePostIdeas(
        params.businessProfile,
        params.ideaType,
        normalizeIdeaCount(params.ideaCount)
      ),
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

export function useUpdatePostIdea() {
  const queryClient = useQueryClient();

  return useMutation<
    SavedPostIdea,
    Error,
    { ideaId: number; ideaType: PostIdeaType; data: UpdatePostIdeaRequest },
    { previousIdeas: SavedPostIdea[] }
  >({
    mutationFn: payload =>
      postService.updatePostIdea(payload.ideaId, payload.data),
    onMutate: async payload => {
      await queryClient.cancelQueries({
        queryKey: POST_IDEAS_KEYS.saved(payload.ideaType),
      });

      const previousIdeas =
        queryClient.getQueryData<SavedPostIdea[]>(
          POST_IDEAS_KEYS.saved(payload.ideaType)
        ) || [];

      queryClient.setQueryData(
        POST_IDEAS_KEYS.saved(payload.ideaType),
        (existing: SavedPostIdea[] = []) =>
          existing.map(item =>
            item.id === payload.ideaId ? { ...item, ...payload.data } : item
          )
      );

      return { previousIdeas };
    },
    onError: (_error, payload, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(
        POST_IDEAS_KEYS.saved(payload.ideaType),
        context.previousIdeas
      );
    },
    onSuccess: data => {
      queryClient.setQueryData(
        POST_IDEAS_KEYS.saved(data.ideaType),
        (existing: SavedPostIdea[] = []) =>
          existing.map(item => (item.id === data.id ? data : item))
      );
    },
  });
}
