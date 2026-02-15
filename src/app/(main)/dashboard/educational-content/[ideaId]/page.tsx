'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessProfileId } from '@/features/business-profile/hooks/useBusinessProfileData';
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
import { ErrorText } from '@/components/common/ErrorText';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ApiError } from '@/lib/api/core/errors';

export default function GeneratedPostPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = use(params);
  const router = useRouter();
  const { data: businessProfileId = null } = useBusinessProfileId();

  const parsedIdeaId = Number(ideaId);
  const hasValidIdeaId =
    Number.isFinite(parsedIdeaId) &&
    Number.isInteger(parsedIdeaId) &&
    parsedIdeaId > 0;

  const imageDownload = useImageDownload({
    filename: FILE_CONSTANTS.DEFAULT_FILENAME,
    successDuration: UI_CONSTANTS.SUCCESS_NOTIFICATION_DURATION,
  });

  const {
    data: selectedIdea,
    isLoading: isIdeaLoading,
    error: ideaError,
    refetch: refetchIdea,
  } = useGetPostIdeaById(hasValidIdeaId ? parsedIdeaId : null);

  useEffect(() => {
    if (!hasValidIdeaId) {
      router.push('/dashboard/educational-content');
    }
  }, [hasValidIdeaId, router]);

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
      router.push('/dashboard/educational-content');
    }
  }, [ideaError, router]);

  if (!businessProfileId || isIdeaLoading || isPostLoading) {
    return <LoadingScreen message="Loading post details..." />;
  }

  if (ideaError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-8">
        <ErrorText
          message="Failed to load idea details. Please try again."
          onRetry={refetchIdea}
        />
      </div>
    );
  }

  if (!selectedIdea) {
    return null;
  }

  if (postError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-8">
        <ErrorText
          message="Failed to generate post. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />

      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="mb-4">
          <GradientButton
            variant="ghost"
            onClick={() => router.push('/dashboard/educational-content')}
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
