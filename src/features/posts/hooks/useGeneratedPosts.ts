import { postService } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type {
  GeneratedPost,
  GeneratedPostDetails,
} from '@/features/posts/types/post';

export function useGeneratedPostsByBusinessProfile(
  businessProfileId: number | null
) {
  const hasValidBusinessProfileId =
    Number.isFinite(businessProfileId) && (businessProfileId as number) > 0;

  return useQuery<GeneratedPost[]>({
    queryKey: ['posts', 'generated', businessProfileId],
    queryFn: async () => {
      const response = await postService.listGeneratedPostsByBusinessProfile(
        businessProfileId as number
      );

      return response.data;
    },
    enabled: hasValidBusinessProfileId,
  });
}

export function useGetGeneratedPostById(imageId: number | null) {
  const hasValidImageId = Number.isFinite(imageId) && (imageId as number) > 0;

  return useQuery<GeneratedPostDetails>({
    queryKey: ['posts', 'generated', 'detail', imageId],
    queryFn: async () => {
      const response = await postService.getGeneratedPostById(
        imageId as number
      );
      return response.data;
    },
    enabled: hasValidImageId,
  });
}
