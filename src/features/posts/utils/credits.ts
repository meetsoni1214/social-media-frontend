import type { InsufficientCreditsDetail } from '@/lib/api';

export function buildInsufficientCreditsMessage(
  detail: InsufficientCreditsDetail
): string {
  const actionLabel =
    detail.action === 'POST_GENERATION' ? 'generate a post' : 'generate ideas';

  return `You need ${detail.requiredCredits} credits to ${actionLabel}, you have ${detail.availableCredits}.`;
}
