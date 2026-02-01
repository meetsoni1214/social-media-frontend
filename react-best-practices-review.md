## React Best Practices Review (Report Only)

### Critical

- **Bundle size risk from barrel icon imports (`lucide-react`)** — consider direct icon imports or Next’s `optimizePackageImports` for `lucide-react` to avoid pulling a large barrel. Safe to apply (or config-only).
  - Example: `src/app/(main)/dashboard/page.tsx`, `src/app/page.tsx`, `src/app/(main)/social-profiles/page.tsx`

- **Unstable React Query key (object in queryKey)** — `params` is an object so reference changes can cause unnecessary cache misses/refetches. Prefer stable keys (IDs/strings) or normalize params. Safe to apply.
  - Example: `src/features/posts/hooks/usePost.ts`

### High

- **Dependent client query waterfall** — `usePosts` waits on ideas list to resolve and then derives `idea` before fetching post, causing a waterfall. Consider a query that fetches by `ideaId`, or server-side generation to parallelize. Needs API/architecture alignment.
  - Example: `src/app/(main)/dashboard/educational-content/[ideaId]/page.tsx`

- **React Query Devtools always bundled** — currently always rendered. Prefer dev-only loading (dynamic import or `process.env.NODE_ENV` guard). Safe to apply.
  - Example: `src/providers/QueryProvider.tsx`

### Medium

- **Manual client fetching in `useEffect`** — this bypasses React Query caching/dedup and creates local waterfalls. Consider React Query hooks for `mockApi` (or move to server side). Safe to apply if API shape is kept.
  - Examples: `src/app/(main)/dashboard/festival-post/page.tsx`, `src/app/(main)/dashboard/quote-post/page.tsx`

- **Inline handlers inside list rendering** — function instances created on every render per item. Extract or memoize if lists grow. Safe to apply.
  - Example: `src/app/(main)/dashboard/educational-content/page.tsx`

### Low

- **Functions defined inside render scope** — `connectSocialAccountsCard` and its handler are recreated each render. Consider extracting to a child component or using `useCallback` where appropriate. Safe to apply.
  - Example: `src/app/(main)/dashboard/page.tsx`

- **Context callback not memoized** — `resetOnboarding` is recreated on every provider render; could trigger consumer rerenders if passed through. Safe to apply.
  - Example: `src/features/business-profile/contexts/OnboardingContext.tsx`
