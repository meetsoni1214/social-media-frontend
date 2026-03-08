import { postService } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { UUID } from '@/types/uuid';
import { postKeys } from '@/features/posts/hooks/postKeys';

interface PostParams {
  postIdeaId: UUID | null;
  businessProfileId: UUID | null;
}

export function usePosts(params: PostParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: postKeys.generation.byIdea(
      params.businessProfileId,
      params.postIdeaId
    ),
    queryFn: () =>
      postService.generatePost(
        params.postIdeaId as UUID,
        params.businessProfileId as UUID
      ),
    enabled: !!params.businessProfileId && !!params.postIdeaId,
  });

  useEffect(() => {
    if (!query.isSuccess || !params.businessProfileId) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: postKeys.generated.list(params.businessProfileId),
    });
  }, [
    query.isSuccess,
    query.dataUpdatedAt,
    params.businessProfileId,
    queryClient,
  ]);

  return query;
}
