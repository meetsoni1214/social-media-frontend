import type {
  PostIdea,
  PostIdeasResponse,
  GeneratedPostResponse,
  GeneratedPostsByBusinessProfileResponse,
  SavedPostIdea,
  SavePostIdeaRequest,
  UpdatePostIdeaRequest,
  PostIdeaType,
} from '@/features/posts/types/post';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import { httpClient } from '../core/http-client';

async function generatePostIdeas(
  businessProfile: BusinessProfileFormData,
  ideaType: PostIdeaType,
  ideaCount?: number
): Promise<PostIdeasResponse> {
  return httpClient.post<PostIdeasResponse>('/post-ideas/generate', {
    businessProfile,
    ideaType,
    ideaCount,
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

async function listGeneratedPostsByBusinessProfile(
  businessProfileId: number
): Promise<GeneratedPostsByBusinessProfileResponse> {
  return httpClient.get<GeneratedPostsByBusinessProfileResponse>(
    `/posts/business-profile/${businessProfileId}`
  );
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

async function updatePostIdea(
  ideaId: number,
  postIdea: UpdatePostIdeaRequest
): Promise<SavedPostIdea> {
  return httpClient.patch<SavedPostIdea>(`/post-ideas/${ideaId}`, postIdea);
}

export const postService = {
  generatePostIdeas,
  generatePost,
  listGeneratedPostsByBusinessProfile,
  listSavedPostIdeas,
  savePostIdea,
  updatePostIdea,
};
