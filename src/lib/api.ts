import type {
  BusinessProfileFormData,
  ContentPreferencesFormData,
} from './validations';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export interface PostIdea {
  id: string;
  title: string;
  content: string;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface PostIdeasResponse {
  success: boolean;
  data: PostIdea[];
}

interface GeneratedPost {
  id: string;
  base64Image: string;
}

interface GeneratedPostRawResponse {
  id: string;
  base64_image: string;
}

interface GeneratedPostResponse {
  success: boolean;
  data: GeneratedPost;
}

interface GeneratedPostRawApiResponse {
  success: boolean;
  data: GeneratedPostRawResponse;
}

class ApiClient {
  async generateProductPromotionIdeas(
    businessProfile: BusinessProfileFormData,
    contentPreferences: ContentPreferencesFormData
  ) {
    const url = `${API_BASE_URL}/post-ideas/promotion`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessProfile,
        contentPreferences,
      }),
    });

    return this.handleResponse<PostIdeasResponse>(response);
  }

  async generateEducationalContentIdeas(
    businessProfile: BusinessProfileFormData,
    contentPreferences: ContentPreferencesFormData
  ) {
    const url = `${API_BASE_URL}/post-ideas/educational`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessProfile,
        contentPreferences,
      }),
    });

    return this.handleResponse<PostIdeasResponse>(response);
  }

  async generatePost(
    businessProfile: BusinessProfileFormData,
    contentPreferences: ContentPreferencesFormData,
    postIdea: PostIdea
  ) {
    const url = `${API_BASE_URL}/posts/generate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessProfile,
        contentPreferences,
        postIdea,
      }),
    });

    const rawResponse =
      await this.handleResponse<GeneratedPostRawApiResponse>(response);

    // Transform snake_case to camelCase
    const transformedResponse: GeneratedPostResponse = {
      success: rawResponse.success,
      data: {
        id: rawResponse.data.id,
        base64Image: rawResponse.data.base64_image,
      },
    };

    return transformedResponse;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error (${response.status}): ${response.statusText}`;
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };

      throw error;
    }

    const data = await response.json();
    return data;
  }
}

export const apiClient = new ApiClient();
