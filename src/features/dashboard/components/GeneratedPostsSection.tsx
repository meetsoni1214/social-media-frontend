'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, RefreshCw } from 'lucide-react';
import { useGeneratedPostsByBusinessProfile } from '@/features/posts/hooks/useGeneratedPosts';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
} from '@/components/common/GradientCard';
import { ErrorText } from '@/components/common/ErrorText';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface GeneratedPostsSectionProps {
  businessProfileId: number | null;
  businessName: string;
}

export function GeneratedPostsSection({
  businessProfileId,
  businessName,
}: GeneratedPostsSectionProps) {
  const [failedImageIds, setFailedImageIds] = useState<number[]>([]);

  const {
    data: generatedPosts = [],
    isLoading: isGeneratedPostsLoading,
    isError: isGeneratedPostsError,
    refetch: refetchGeneratedPosts,
    isFetching: isRefetchingGeneratedPosts,
  } = useGeneratedPostsByBusinessProfile(businessProfileId);

  const visibleGeneratedPosts = generatedPosts
    .filter(post => !failedImageIds.includes(post.imageId))
    .slice(0, 6);

  return (
    <div className="mt-8">
      <GradientCard>
        <GradientCardHeader>
          <GradientCardTitle>Generated Posts</GradientCardTitle>
          <GradientCardDescription>
            {`Your recently generated Posts for ${businessName}`}
          </GradientCardDescription>
        </GradientCardHeader>

        {isGeneratedPostsLoading ? (
          <LoadingSpinner
            size="md"
            message="Loading images..."
            className="mt-2"
          />
        ) : isGeneratedPostsError ? (
          <div className="mt-2">
            <ErrorText
              message="Failed to load generated images."
              onRetry={() => {
                refetchGeneratedPosts();
              }}
            />
          </div>
        ) : visibleGeneratedPosts.length === 0 ? (
          <div className="flex items-center gap-3 mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <ImageIcon className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">
              No generated images yet. Create your first post to see images
              here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {visibleGeneratedPosts.map(post => (
                <div
                  key={post.imageId}
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 aspect-square"
                >
                  <Image
                    src={post.imageUrl}
                    alt={`Generated post ${post.imageId}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    onError={() => {
                      setFailedImageIds(current => {
                        if (current.includes(post.imageId)) {
                          return current;
                        }
                        return [...current, post.imageId];
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            {failedImageIds.length > 0 && (
              <button
                type="button"
                className="inline-flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => {
                  setFailedImageIds([]);
                  void refetchGeneratedPosts();
                }}
                disabled={isRefetchingGeneratedPosts}
              >
                <RefreshCw className="h-4 w-4" />
                {isRefetchingGeneratedPosts
                  ? 'Refreshing images...'
                  : 'Retry failed images'}
              </button>
            )}
          </>
        )}
      </GradientCard>
    </div>
  );
}
