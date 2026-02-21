import { postService } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type {
  GeneratedPost,
  GeneratedPostDetails,
} from '@/features/posts/types/post';
import type { UUID } from '@/types/uuid';

export function useGeneratedPostsByBusinessProfile(
  businessProfileId: UUID | null
) {
  return useQuery<GeneratedPost[]>({
    queryKey: ['posts', 'generated', businessProfileId],
    queryFn: async () => {
      const response = await postService.listGeneratedPostsByBusinessProfile(
        businessProfileId as UUID
      );

      return response.data;
    },
    enabled: !!businessProfileId,
  });
}

export function useGetGeneratedPostById(imageId: UUID | null) {
  return useQuery<GeneratedPostDetails>({
    queryKey: ['posts', 'generated', 'detail', imageId],
    queryFn: async () => {
      const response = await postService.getGeneratedPostById(imageId as UUID);
      return response.data;
    },
    enabled: !!imageId,
  });
}
