'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessProfileId } from '@/features/business-profile/hooks/useBusinessProfileData';
import { useGeneratedPostsByBusinessProfile } from '@/features/posts/hooks/useGeneratedPosts';
import { useImageDownload } from '@/features/posts/hooks/useImageDownload';
import { PostImageDisplay } from '@/features/posts/components/PostImageDisplay';
import { SocialProfileShareSection } from '@/features/posts/components/SocialProfileShareSection';
import { ErrorCard } from '@/components/common/ErrorCard';
import { ErrorText } from '@/components/common/ErrorText';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { GradientCard } from '@/components/common/GradientCard';

const DEFAULT_FILENAME = 'generated_post.png';

export default function GeneratedImageDetailPage({
  params,
}: {
  params: Promise<{ imageId: string }>;
}) {
  const { imageId } = use(params);
  const router = useRouter();
  const { data: businessProfileId = null } = useBusinessProfileId();
  const parsedImageId = Number(imageId);

  const imageDownload = useImageDownload({
    filename: DEFAULT_FILENAME,
  });

  const {
    data: generatedPosts = [],
    isLoading: isGeneratedPostsLoading,
    error: generatedPostsError,
    refetch: refetchGeneratedPosts,
    isFetching: isRefetchingGeneratedPosts,
  } = useGeneratedPostsByBusinessProfile(businessProfileId);

  const selectedPost = useMemo(
    () => generatedPosts.find(post => post.imageId === parsedImageId),
    [generatedPosts, parsedImageId]
  );

  const handleDownload = async () => {
    if (!selectedPost?.imageUrl) {
      return;
    }

    const filename = `generated_post_${selectedPost.imageId}.png`;

    await imageDownload.downloadImageFromUrl(selectedPost.imageUrl, filename);
  };

  if (!businessProfileId || isGeneratedPostsLoading) {
    return <LoadingScreen message="Loading generated image..." />;
  }

  if (generatedPostsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-8">
        <ErrorText
          message="Failed to load generated image. Please try again."
          onRetry={() => {
            void refetchGeneratedPosts();
          }}
        />
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <ErrorCard
        title="Image not found"
        message="Generated image not found."
        actionLabel="Back to Dashboard"
        onAction={() => router.push('/dashboard')}
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
            Preview, download, and share your generated image.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
          <PostImageDisplay
            imageSrc={selectedPost.imageUrl}
            isLoading={isRefetchingGeneratedPosts}
            error={null}
            onRetry={() => {
              void refetchGeneratedPosts();
            }}
            alt={`Generated post ${selectedPost.imageId}`}
            height="h-[512px]"
          />

          <div className="space-y-4">
            <GradientCard>
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Caption
              </h3>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                  Idea details are unavailable for this generated image.
                </p>
              </div>
            </GradientCard>

            <SocialProfileShareSection
              onDownload={handleDownload}
              isDownloading={imageDownload.isDownloading}
              downloadSuccess={imageDownload.downloadSuccess}
              downloadDisabled={!selectedPost.imageUrl}
              postTitle={`Generated Post ${selectedPost.imageId}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
