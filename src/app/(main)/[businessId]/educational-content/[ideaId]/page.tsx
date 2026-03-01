'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GradientButton } from '@/components/common/GradientButton';
import { useGetPostIdeaById } from '@/features/posts/hooks/usePostIdeas';
import { usePosts } from '@/features/posts/hooks/usePost';
import { useImageDownload } from '@/features/posts/hooks/useImageDownload';
import { GradientBar } from '@/components/common/GradientBar';
import { PostImageDisplay } from '@/features/posts/components/PostImageDisplay';
import { PostCaption } from '@/features/posts/components/PostCaption';
import { SocialProfileShareSection } from '@/features/posts/components/SocialProfileShareSection';
import { UI_CONSTANTS, FILE_CONSTANTS } from './constants';
import { ErrorCard } from '@/components/common/ErrorCard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useToast } from '@/components/common/Toast';
import { ApiError } from '@/lib/api/core/errors';
import { uuidSchema } from '@/lib/utils/validation';
import type { UUID } from '@/types/uuid';

export default function GeneratedPostPage({
  params,
}: {
  params: Promise<{ businessId: string; ideaId: string }>;
}) {
  const { businessId, ideaId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const hasValidBusinessId = uuidSchema.safeParse(businessId).success;
  const businessProfileId = hasValidBusinessId ? (businessId as UUID) : null;
  const hasValidIdeaId = uuidSchema.safeParse(ideaId).success;

  const imageDownload = useImageDownload({
    filename: FILE_CONSTANTS.DEFAULT_FILENAME,
    successDuration: UI_CONSTANTS.SUCCESS_NOTIFICATION_DURATION,
  });

  const {
    data: selectedIdea,
    isLoading: isIdeaLoading,
    error: ideaError,
    refetch: refetchIdea,
  } = useGetPostIdeaById(businessProfileId, hasValidIdeaId ? ideaId : null);

  useEffect(() => {
    if (!hasValidBusinessId || !hasValidIdeaId) {
      router.push('/businesses');
    }
  }, [hasValidBusinessId, hasValidIdeaId, router]);

  const {
    data: postResponse,
    isLoading: isPostLoading,
    error: postError,
    refetch,
  } = usePosts({
    postIdeaId: selectedIdea?.id ?? null,
    businessProfileId,
  });

  const handleDownload = async () => {
    if (!postResponse?.data?.imageUrl) {
      return;
    }

    const filename = selectedIdea?.title
      ? `${selectedIdea.title
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase()}_post.png`
      : FILE_CONSTANTS.DEFAULT_FILENAME;

    await imageDownload.downloadImageFromUrl(
      postResponse.data.imageUrl,
      filename
    );
  };

  useEffect(() => {
    if (
      ideaError instanceof ApiError &&
      (ideaError.status === 404 || ideaError.status === 403)
    ) {
      router.push(`/${businessId}/educational-content`);
    }
  }, [businessId, ideaError, router]);

  useEffect(() => {
    if (ideaError) {
      showToast('Failed to load idea details. Please try again.', 'error');
    }
  }, [ideaError, showToast]);

  useEffect(() => {
    if (postError) {
      showToast('Failed to generate post. Please try again.', 'error');
    }
  }, [postError, showToast]);

  if (!businessProfileId || isIdeaLoading || isPostLoading) {
    return <LoadingScreen message="Loading post details..." />;
  }

  if (ideaError) {
    return (
      <ErrorCard
        title="Unable to load idea"
        message="Failed to load idea details. Please try again."
        actionLabel="Retry"
        onAction={() => {
          void refetchIdea();
        }}
      />
    );
  }

  if (!selectedIdea) {
    return null;
  }

  if (postError) {
    return (
      <ErrorCard
        title="Unable to generate post"
        message="Failed to generate post. Please try again."
        actionLabel="Retry"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />

      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="mb-4">
          <GradientButton
            variant="ghost"
            onClick={() => router.push(`/${businessId}/educational-content`)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </GradientButton>
        </div>

        <div className="animate-fade-in">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold gradient-text mb-1">
              Your Generated Post
            </h1>
            <p className="text-sm text-gray-600">
              Preview, download, and share your content
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
            <PostImageDisplay
              imageSrc={postResponse?.data?.imageUrl}
              isLoading={isPostLoading}
              error={postError}
              onRetry={refetch}
              alt="Generated educational post"
              height="h-[512px]"
            />

            <div className="space-y-4">
              <PostCaption
                title={selectedIdea.title}
                content={selectedIdea.content}
              />

              <SocialProfileShareSection
                businessProfileId={businessProfileId}
                onDownload={handleDownload}
                isDownloading={imageDownload.isDownloading}
                downloadSuccess={imageDownload.downloadSuccess}
                downloadDisabled={!postResponse?.data?.imageUrl}
                postTitle={selectedIdea.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
