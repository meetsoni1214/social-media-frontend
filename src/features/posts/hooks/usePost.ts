import { postService } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface PostParams {
  postIdeaId: number | null;
  businessProfileId: number | null;
}

export function usePosts(params: PostParams) {
  const hasValidParams =
    Number.isFinite(params.businessProfileId) &&
    Number.isFinite(params.postIdeaId) &&
    (params.businessProfileId as number) > 0 &&
    (params.postIdeaId as number) > 0;

  return useQuery({
    queryKey: ['post', params.businessProfileId, params.postIdeaId],
    queryFn: () =>
      postService.generatePost(
        params.postIdeaId as number,
        params.businessProfileId as number
      ),
    enabled: hasValidParams,
  });
}
