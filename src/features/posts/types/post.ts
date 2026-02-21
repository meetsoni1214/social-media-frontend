import type { UUID } from '@/types/uuid';

export type PostIdeaType = 'PROMOTIONAL' | 'EDUCATIONAL';

export interface PostIdea {
  id: string;
  title: string;
  content: string;
}

export interface SavedPostIdea {
  id: UUID;
  userId: UUID;
  businessProfileId: UUID;
  title: string;
  content: string;
  ideaType: PostIdeaType;
  createdAt: string;
  updatedAt: string | null;
}

export interface SavePostIdeaRequest {
  title: string;
  content: string;
  ideaType: PostIdeaType;
}

export interface UpdatePostIdeaRequest {
  title?: string;
  content?: string;
  ideaType?: PostIdeaType;
}

export interface PostIdeasResponse {
  success: boolean;
  data: PostIdea[];
}

export interface GeneratedPost {
  imageId: UUID;
  businessProfileId: UUID;
  postIdeaId: UUID | null;
  status: string;
  imageUrl: string;
  expiresIn: number;
}

export interface GeneratedPostResponse {
  success: boolean;
  data: GeneratedPost;
}

export interface GeneratedPostsByBusinessProfileResponse {
  success: boolean;
  data: GeneratedPost[];
}

export interface GeneratedPostIdeaDetails {
  id: UUID;
  title: string;
  content: string;
  ideaType: PostIdeaType;
}

export interface GeneratedPostDetails extends GeneratedPost {
  postIdea: GeneratedPostIdeaDetails | null;
}

export interface GeneratedPostDetailsResponse {
  success: boolean;
  data: GeneratedPostDetails;
}
