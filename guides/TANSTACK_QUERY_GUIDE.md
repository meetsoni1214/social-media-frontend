# TanStack Query Integration Guide

## Overview

This project now uses **TanStack Query (React Query)** for optimized API call management. This provides automatic caching, background refetching, request deduplication, and more.

## Architecture

### 1. Query Client Configuration (`src/lib/queryClient.ts`)

The QueryClient is configured with sensible defaults:

- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes
- **Garbage Collection Time**: 10 minutes - Unused data is kept for 10 minutes
- **Retry Logic**: 2 retries with exponential backoff
- **Refetch on Window Focus**: Disabled (to prevent unnecessary refetches)
- **Refetch on Mount**: Enabled (ensures fresh data when components mount)

### 2. Query Provider (`src/providers/QueryProvider.tsx`)

Wraps the entire application with `QueryClientProvider` and includes React Query DevTools for development.

**DevTools**: Press the React Query icon in the bottom-left corner (dev mode only) to:

- View all queries and their states
- See cached data
- Manually refetch or invalidate queries
- Monitor network activity

### 3. Custom Hooks (`src/hooks/usePostIdeas.ts`)

Contains all the React Query hooks for post idea generation:

#### Query Hooks (GET-like operations)

- `useProductPromotionIdeas()` - Fetches product promotion ideas
- `useEducationalContentIdeas()` - Fetches educational content ideas

#### Mutation Hooks (POST-like operations)

- `useGenerateProductPromotionIdeas()` - Triggers new product promotion generation
- `useGenerateEducationalContentIdeas()` - Triggers new educational content generation

#### Utility Hooks

- `useInvalidatePostIdeas()` - Invalidates all post idea caches

## Benefits

### 1. **Automatic Caching**

Data is cached automatically. If you navigate away and come back within 5 minutes, the data loads instantly from cache.

### 2. **Request Deduplication**

Multiple components requesting the same data simultaneously will only trigger one API call.

### 3. **Background Refetching**

Stale data is refetched in the background automatically when conditions are met.

### 4. **Optimistic Updates**

Mutations can update the cache immediately, making the UI feel instant.

### 5. **Built-in Loading & Error States**

No need to manage `isLoading`, `error`, `data` states manually - React Query handles it.

### 6. **Memory Efficiency**

Unused query data is automatically garbage collected after 10 minutes.

### 7. **Retry Logic**

Failed requests are automatically retried with exponential backoff.

## Usage Examples

### Basic Query Usage

```typescript
import { useProductPromotionIdeas } from '@/hooks/usePostIdeas';

function MyComponent() {
  const { data, isLoading, error, refetch } = useProductPromotionIdeas({
    businessProfile,
    contentPreferences,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  const ideas = data?.data || [];
  return <IdeasList ideas={ideas} />;
}
```

### Using Mutations

```typescript
import { useGenerateProductPromotionIdeas } from '@/hooks/usePostIdeas';

function GenerateButton() {
  const { mutate, isPending } = useGenerateProductPromotionIdeas();

  const handleGenerate = () => {
    mutate(
      { businessProfile, contentPreferences },
      {
        onSuccess: (data) => {
          console.log('Generated:', data);
        },
        onError: (error) => {
          console.error('Error:', error);
        },
      }
    );
  };

  return (
    <button onClick={handleGenerate} disabled={isPending}>
      {isPending ? 'Generating...' : 'Generate Ideas'}
    </button>
  );
}
```

### Invalidating Cache

```typescript
import { useInvalidatePostIdeas } from '@/hooks/usePostIdeas';

function RefreshButton() {
  const invalidatePostIdeas = useInvalidatePostIdeas();

  const handleRefresh = () => {
    invalidatePostIdeas();
  };

  return <button onClick={handleRefresh}>Refresh All</button>;
}
```

## Query Keys Structure

Query keys are organized hierarchically:

```
['post-ideas']                           // All post ideas
['post-ideas', 'promotion', params]      // Product promotion ideas
['post-ideas', 'educational', params]    // Educational content ideas
```

This structure allows:

- Invalidating all post ideas: `['post-ideas']`
- Invalidating specific type: `['post-ideas', 'promotion']`
- Invalidating specific query: `['post-ideas', 'promotion', params]`

## Adding New API Endpoints

To add a new API endpoint with React Query:

### 1. Add the API method to `src/lib/api.ts`

```typescript
async generateQuotePostIdeas(
  businessProfile: BusinessProfileFormData,
  contentPreferences: ContentPreferencesFormData
) {
  const url = `${API_BASE_URL}/post-ideas/quote`;
  const response = await this.fetchWithRetry(url, {
    method: 'POST',
    body: JSON.stringify({ businessProfile, contentPreferences }),
  });
  return this.handleResponse<PostIdeasResponse>(response);
}
```

### 2. Add the hook to `src/hooks/usePostIdeas.ts`

```typescript
const POST_IDEAS_KEYS = {
  all: ['post-ideas'] as const,
  // ... existing keys
  quote: (params: PostIdeasParams) =>
    [...POST_IDEAS_KEYS.all, 'quote', params] as const,
};

export function useQuotePostIdeas(params: PostIdeasParams) {
  return useQuery({
    queryKey: POST_IDEAS_KEYS.quote(params),
    queryFn: () =>
      apiClient.generateQuotePostIdeas(
        params.businessProfile,
        params.contentPreferences
      ),
    enabled: !!params.businessProfile && !!params.contentPreferences,
  });
}
```

### 3. Use in your component

```typescript
import { useQuotePostIdeas } from '@/hooks/usePostIdeas';

function QuotePostPage() {
  const { data, isLoading, error } = useQuotePostIdeas({
    businessProfile,
    contentPreferences,
  });

  // ... rest of component
}
```

## Best Practices

### 1. Use Query Keys Consistently

Always use the centralized query key factory to ensure proper cache invalidation.

### 2. Enable Queries Conditionally

Use the `enabled` option to prevent queries from running when dependencies aren't ready:

```typescript
useQuery({
  queryKey: ['data', id],
  queryFn: () => fetchData(id),
  enabled: !!id, // Only run when id is available
});
```

### 3. Handle Loading and Error States

Always provide good UX for loading and error states.

### 4. Use Mutations for Side Effects

For POST, PUT, DELETE operations that change server state, use `useMutation` instead of `useQuery`.

### 5. Invalidate Related Queries

After mutations, invalidate related queries to keep the UI in sync:

```typescript
const queryClient = useQueryClient();

useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

### 6. Monitor with DevTools

Use the React Query DevTools during development to understand query behavior and debug issues.

## Performance Tips

1. **Adjust Stale Time**: If data changes rarely, increase `staleTime` to reduce unnecessary refetches.
2. **Prefetch Data**: Use `queryClient.prefetchQuery()` to load data before users need it.
3. **Use Select**: Transform query data efficiently with the `select` option.
4. **Implement Pagination**: For large datasets, use `useInfiniteQuery`.

## Troubleshooting

### Query Not Refetching

- Check if `enabled` is set to `false`
- Verify the query key is unique and correctly structured
- Check if `staleTime` is too high

### Data Not Updating After Mutation

- Ensure you're invalidating the correct query keys
- Consider using `setQueryData` for optimistic updates

### Too Many Refetches

- Adjust `refetchOnWindowFocus` and `refetchOnMount`
- Increase `staleTime` for stable data

### Memory Issues

- Adjust `gcTime` (garbage collection time)
- Limit the number of concurrent queries

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
