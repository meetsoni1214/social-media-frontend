import type { UUID } from '@/types/uuid';

export function businessFestivalRoute(businessId: UUID): string {
  return `/${businessId}/festival-post`;
}

export function businessProductPromotionRoute(businessId: UUID): string {
  return `/${businessId}/product-promotion`;
}

export function businessEducationalContentRoute(businessId: UUID): string {
  return `/${businessId}/educational-content`;
}

export function businessEducationalIdeaRoute(
  businessId: UUID,
  ideaId: UUID
): string {
  return `/${businessId}/educational-content/${ideaId}`;
}

export function businessQuotePostRoute(businessId: UUID): string {
  return `/${businessId}/quote-post`;
}

export function businessSocialProfilesRoute(businessId: UUID): string {
  return `/${businessId}/social-profiles`;
}
