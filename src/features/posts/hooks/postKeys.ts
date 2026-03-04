import type { PostIdeaType } from '@/features/posts/types/post';
import type { UUID } from '@/types/uuid';

export const postKeys = {
  generated: {
    all: ['posts', 'generated'] as const,
    list: (businessProfileId: UUID | null) =>
      [...postKeys.generated.all, 'list', businessProfileId] as const,
    detail: (businessProfileId: UUID | null, imageId: UUID | null) =>
      [
        ...postKeys.generated.all,
        'detail',
        businessProfileId,
        imageId,
      ] as const,
  },
  ideas: {
    all: ['post-ideas'] as const,
    saved: (businessProfileId: UUID | null, ideaType: PostIdeaType) =>
      [...postKeys.ideas.all, 'saved', businessProfileId, ideaType] as const,
    detail: (businessProfileId: UUID | null, ideaId: UUID | null) =>
      [...postKeys.ideas.all, 'detail', businessProfileId, ideaId] as const,
  },
  generation: {
    all: ['post'] as const,
    byIdea: (businessProfileId: UUID | null, postIdeaId: UUID | null) =>
      [...postKeys.generation.all, businessProfileId, postIdeaId] as const,
  },
};
