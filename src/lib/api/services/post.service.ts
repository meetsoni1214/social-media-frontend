import type {
  PostIdea,
  PostIdeasResponse,
  GeneratedPostResponse,
} from '@/features/posts/types/post';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import { httpClient } from '../core/http-client';

async function generatePromotionIdeas(
  businessProfile: BusinessProfileFormData
): Promise<PostIdeasResponse> {
  return httpClient.post<PostIdeasResponse>('/post-ideas/promotion', {
    businessProfile,
  });
}

async function generateEducationalIdeas(
  businessProfile: BusinessProfileFormData
): Promise<PostIdeasResponse> {
  return httpClient.post<PostIdeasResponse>('/post-ideas/educational', {
    businessProfile,
  });
}

async function generatePost(
  businessProfile: BusinessProfileFormData,
  postIdea: PostIdea
): Promise<GeneratedPostResponse> {
  return httpClient.post<GeneratedPostResponse>('/posts/generate', {
    businessProfile,
    postIdea,
  });
}

export const postService = {
  generatePromotionIdeas,
  generateEducationalIdeas,
  generatePost,
};
