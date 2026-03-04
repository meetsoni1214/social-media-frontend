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
import type { UUID } from '@/types/uuid';
import { normalizeIdeaCount } from '@/features/posts/utils/ideaCount';
import { postKeys } from '@/features/posts/hooks/postKeys';

interface PostIdeasParams {
  businessProfileId: UUID;
  businessProfile: BusinessProfileFormData;
  ideaType: PostIdeaType;
  ideaCount?: number;
}

export function useGetSavedPostIdeas(
  businessProfileId: UUID | null,
  ideaType: PostIdeaType
) {
  return useQuery<SavedPostIdea[]>({
    queryKey: postKeys.ideas.saved(businessProfileId, ideaType),
    queryFn: () =>
      postService.listSavedPostIdeas(businessProfileId as UUID, ideaType),
    enabled: !!businessProfileId,
  });
}

export function useGetPostIdeaById(
  businessProfileId: UUID | null,
  ideaId: UUID | null
) {
  return useQuery<SavedPostIdea>({
    queryKey: postKeys.ideas.detail(businessProfileId, ideaId),
    queryFn: () =>
      postService.getPostIdeaById(ideaId as UUID, businessProfileId as UUID),
    enabled: !!ideaId && !!businessProfileId,
  });
}

export function useGeneratePostIdeas() {
  return useMutation<PostIdeasResponse, Error, PostIdeasParams>({
    mutationFn: params =>
      postService.generatePostIdeas(
        params.businessProfileId,
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
        postKeys.ideas.saved(data.businessProfileId, data.ideaType),
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
    {
      businessProfileId: UUID;
      ideaId: UUID;
      ideaType: PostIdeaType;
      data: UpdatePostIdeaRequest;
    },
    { previousIdeas: SavedPostIdea[] }
  >({
    mutationFn: payload =>
      postService.updatePostIdea(payload.ideaId, payload.data),
    onMutate: async payload => {
      await queryClient.cancelQueries({
        queryKey: postKeys.ideas.saved(
          payload.businessProfileId,
          payload.ideaType
        ),
      });

      const previousIdeas =
        queryClient.getQueryData<SavedPostIdea[]>(
          postKeys.ideas.saved(payload.businessProfileId, payload.ideaType)
        ) || [];

      queryClient.setQueryData(
        postKeys.ideas.saved(payload.businessProfileId, payload.ideaType),
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
        postKeys.ideas.saved(payload.businessProfileId, payload.ideaType),
        context.previousIdeas
      );
    },
    onSuccess: data => {
      queryClient.setQueryData(
        postKeys.ideas.saved(data.businessProfileId, data.ideaType),
        (existing: SavedPostIdea[] = []) =>
          existing.map(item => (item.id === data.id ? data : item))
      );
    },
  });
}
