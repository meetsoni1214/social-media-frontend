'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft } from 'lucide-react';
import { GradientButton } from '@/components/GradientButton';
import { useEducationalContentIdeas } from '@/hooks/usePostIdeas';
import { usePosts } from '@/hooks/usePost';
import { useImageDownload } from '@/hooks/useImageDownload';
import { useSocialShare } from '@/hooks/useSocialShare';
import { GradientBar } from '@/components/GradientBar';
import { PostImageDisplay } from '@/components/PostImageDisplay';
import { PostCaption } from '@/components/PostCaption';
import { ShareActions } from '@/components/ShareActions';
import { UI_CONSTANTS, MESSAGES, FILE_CONSTANTS } from './constants';
import { ErrorText } from '@/components/ErrorText';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function GeneratedPostPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = use(params);
  const router = useRouter();
  const { businessProfile, isBusinessProfileComplete } = useOnboarding();

  const imageDownload = useImageDownload({
    filename: FILE_CONSTANTS.DEFAULT_FILENAME,
    successDuration: UI_CONSTANTS.SUCCESS_NOTIFICATION_DURATION,
  });

  const socialShare = useSocialShare();

  const { data: response, isLoading } = useEducationalContentIdeas({
    businessProfile: businessProfile!,
  });

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push('/business-profile');
    }
  }, [isBusinessProfileComplete, router]);

  const postIdeas = response?.data || [];
  const idea = postIdeas.find(idea => idea.id === ideaId);

  useEffect(() => {
    if (!isLoading && !idea && postIdeas.length > 0) {
      router.push('/dashboard/educational-content');
    }
  }, [idea, isLoading, postIdeas.length, router]);

  const {
    data: postResponse,
    isLoading: isPostLoading,
    error,
    refetch,
  } = usePosts({
    businessProfile: businessProfile!,
    postIdea: idea!,
  });

  const handleDownload = async () => {
    if (!postResponse?.data?.base64Image) {
      return;
    }

    const filename = idea?.title
      ? `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_post.png`
      : FILE_CONSTANTS.DEFAULT_FILENAME;

    await imageDownload.downloadImage(postResponse.data.base64Image, filename);
  };

  const handleWhatsAppShare = () => {
    socialShare.shareToWhatsApp({
      text: idea?.title || MESSAGES.SOCIAL.WHATSAPP_DEFAULT,
    });
  };

  const handleFacebookShare = () => {
    if (!postResponse?.data?.base64Image) {
      alert(MESSAGES.SOCIAL.FACEBOOK_IMAGE_NOT_READY);
      return;
    }

    socialShare.shareToFacebook({
      url: window.location.href,
    });
  };

  const handleInstagramShare = () => {
    socialShare.shareToInstagram();
  };

  if (!businessProfile || isLoading || isPostLoading) {
    return <LoadingScreen message="Loading post details..." />;
  }

  if (!idea) {
    return null;
  }

  if (error) {
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
              imageData={postResponse?.data?.base64Image}
              isLoading={isPostLoading}
              error={error}
              onRetry={refetch}
              alt="Generated educational post"
              height="h-[512px]"
            />

            <div className="space-y-4">
              <PostCaption title={idea.title} content={idea.content} />

              <ShareActions
                onDownload={handleDownload}
                isDownloading={imageDownload.isDownloading}
                downloadSuccess={imageDownload.downloadSuccess}
                downloadDisabled={!postResponse?.data?.base64Image}
                onWhatsAppShare={handleWhatsAppShare}
                onFacebookShare={handleFacebookShare}
                onInstagramShare={handleInstagramShare}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
