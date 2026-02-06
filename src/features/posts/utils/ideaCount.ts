export const MIN_IDEA_COUNT = 1;
export const MAX_IDEA_COUNT = 5;
export const DEFAULT_IDEA_COUNT = 1;

export function normalizeIdeaCount(ideaCount?: number): number {
  if (!Number.isFinite(ideaCount)) {
    return DEFAULT_IDEA_COUNT;
  }

  const parsedCount = Math.floor(ideaCount as number);
  return Math.min(MAX_IDEA_COUNT, Math.max(MIN_IDEA_COUNT, parsedCount));
}
