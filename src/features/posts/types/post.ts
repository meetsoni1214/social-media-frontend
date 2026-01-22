export interface PostIdea {
  id: string;
  title: string;
  content: string;
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
