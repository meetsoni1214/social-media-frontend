import { postService } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { UUID } from '@/types/uuid';

interface PostParams {
  postIdeaId: UUID | null;
  businessProfileId: UUID | null;
}

export function usePosts(params: PostParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['post', params.businessProfileId, params.postIdeaId],
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
      queryKey: ['posts', 'generated', params.businessProfileId],
    });
  }, [
    query.isSuccess,
    query.dataUpdatedAt,
    params.businessProfileId,
    queryClient,
  ]);

  return query;
}
