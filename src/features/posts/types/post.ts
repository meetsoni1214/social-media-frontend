export type PostIdeaType = 'PROMOTIONAL' | 'EDUCATIONAL';

export interface PostIdea {
  id: string;
  title: string;
  content: string;
}

export interface SavedPostIdea {
  id: number;
  userId: number;
  businessProfileId: number;
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
  id: string;
  base64Image: string;
}

export interface GeneratedPostResponse {
  success: boolean;
  data: GeneratedPost;
}
