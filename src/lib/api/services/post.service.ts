import type {
  PostIdea,
  PostIdeasResponse,
  GeneratedPostResponse,
  SavedPostIdea,
  SavePostIdeaRequest,
  PostIdeaType,
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

const IDEA_TYPE_QUERY_MAP: Record<PostIdeaType, string> = {
  PROMOTIONAL: 'PROMOTIONAL',
  EDUCATIONAL: 'EDUCATIONAL',
};

async function listSavedPostIdeas(
  ideaType?: PostIdeaType
): Promise<SavedPostIdea[]> {
  const query = ideaType ? `?idea_type=${IDEA_TYPE_QUERY_MAP[ideaType]}` : '';
  return httpClient.get<SavedPostIdea[]>(`/post-ideas${query}`);
}

async function savePostIdea(
  postIdea: SavePostIdeaRequest
): Promise<SavedPostIdea> {
  return httpClient.post<SavedPostIdea>('/post-ideas', postIdea);
}

export const postService = {
  generatePromotionIdeas,
  generateEducationalIdeas,
  generatePost,
  listSavedPostIdeas,
  savePostIdea,
};
