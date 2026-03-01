'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetGeneratedPostById } from '@/features/posts/hooks/useGeneratedPosts';
import { useImageDownload } from '@/features/posts/hooks/useImageDownload';
import { PostImageDisplay } from '@/features/posts/components/PostImageDisplay';
import { PostCaption } from '@/features/posts/components/PostCaption';
import { SocialProfileShareSection } from '@/features/posts/components/SocialProfileShareSection';
import { ErrorCard } from '@/components/common/ErrorCard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { GradientCard } from '@/components/common/GradientCard';
import { useToast } from '@/components/common/Toast';
import { uuidSchema } from '@/lib/utils/validation';
import type { UUID } from '@/types/uuid';

const DEFAULT_FILENAME = 'generated_post.png';

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ businessId: string; imageId: string }>;
}) {
  const { businessId, imageId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const hasValidBusinessId = uuidSchema.safeParse(businessId).success;
  const businessProfileId = hasValidBusinessId ? (businessId as UUID) : null;
  const hasValidImageId = uuidSchema.safeParse(imageId).success;
  const postImageId = hasValidImageId ? imageId : null;

  const imageDownload = useImageDownload({
    filename: DEFAULT_FILENAME,
  });

  const {
    data: selectedPost,
    isLoading: isPostLoading,
    error: postError,
    refetch: refetchPost,
    isFetching: isRefetchingPost,
  } = useGetGeneratedPostById(postImageId, businessProfileId);

  useEffect(() => {
    if (!hasValidBusinessId || !hasValidImageId) {
      router.push('/businesses');
    }
  }, [hasValidBusinessId, hasValidImageId, router]);

  useEffect(() => {
    if (postError) {
      showToast('Failed to load generated post. Please try again.', 'error');
    }
  }, [postError, showToast]);

  if (!hasValidImageId) {
    return null;
  }

  if (!businessProfileId) {
    return <LoadingScreen message="Loading business context..." />;
  }

  const handleDownload = async () => {
    if (!selectedPost?.imageUrl) {
      return;
    }

    const filename = `generated_post_${selectedPost.imageId}.png`;
    await imageDownload.downloadImageFromUrl(selectedPost.imageUrl, filename);
  };

  if (isPostLoading) {
    return <LoadingScreen message="Loading generated post..." />;
  }

  if (postError) {
    return (
      <ErrorCard
        title="Unable to load post"
        message="Failed to load generated post. Please try again."
        actionLabel="Retry"
        onAction={() => {
          void refetchPost();
        }}
      />
    );
  }

  if (!selectedPost) {
    return (
      <ErrorCard
        title="Post not found"
        message="Generated post not found."
        actionLabel="Back to Dashboard"
        onAction={() => router.push(`/${businessId}`)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <div className="animate-fade-in">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold gradient-text mb-1">
            Generated Post
          </h1>
          <p className="text-sm text-gray-600">
            Preview, download, and share your generated content.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
          <PostImageDisplay
            imageSrc={selectedPost.imageUrl}
            isLoading={isRefetchingPost}
            error={null}
            onRetry={() => {
              void refetchPost();
            }}
            alt={`Generated post ${selectedPost.imageId}`}
            height="h-[512px]"
          />

          <div className="space-y-4">
            {selectedPost.postIdea ? (
              <PostCaption
                title={selectedPost.postIdea.title}
                content={selectedPost.postIdea.content}
              />
            ) : (
              <GradientCard>
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  Caption
                </h3>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Idea details are unavailable for this generated post.
                  </p>
                </div>
              </GradientCard>
            )}

            <SocialProfileShareSection
              businessProfileId={businessProfileId}
              onDownload={handleDownload}
              isDownloading={imageDownload.isDownloading}
              downloadSuccess={imageDownload.downloadSuccess}
              downloadDisabled={!selectedPost.imageUrl}
              postTitle={
                selectedPost.postIdea?.title ||
                `Generated Post ${selectedPost.imageId}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
