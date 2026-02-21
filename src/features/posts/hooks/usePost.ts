import { postService } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { UUID } from '@/types/uuid';

interface PostParams {
  postIdeaId: UUID | null;
  businessProfileId: UUID | null;
}

export function usePosts(params: PostParams) {
  return useQuery({
    queryKey: ['post', params.businessProfileId, params.postIdeaId],
    queryFn: () =>
      postService.generatePost(
        params.postIdeaId as UUID,
        params.businessProfileId as UUID
      ),
    enabled: !!params.businessProfileId && !!params.postIdeaId,
  });
}
