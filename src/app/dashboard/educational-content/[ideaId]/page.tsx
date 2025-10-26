'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft, Download, Loader2, CheckCircle } from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from '@/components/icons/SocialIcons';
import { GradientCard } from '@/components/GradientCard';
import { GradientButton } from '@/components/GradientButton';
import { GradientIconButton } from '@/components/GradientIconButton';
import { useEducationalContentIdeas } from '@/hooks/usePostIdeas';
import Image from 'next/image';

export default function GeneratedPostPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = use(params);
  const router = useRouter();
  const { businessProfile, contentPreferences, isBusinessProfileComplete } =
    useOnboarding();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { data: response, isLoading } = useEducationalContentIdeas({
    businessProfile: businessProfile!,
    contentPreferences: contentPreferences!,
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

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const response = await fetch('/placeholder.png');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = idea?.title
        ? `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_post.png`
        : 'educational_post.png';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const caption = idea?.title || 'Check out this post!';
    const text = encodeURIComponent(caption);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.origin + '/placeholder.png');
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleInstagramShare = () => {
    alert(
      'Please download the image and share it on Instagram manually. Instagram does not support direct web sharing.'
    );
  };

  if (!businessProfile || !contentPreferences || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--gradient-pink)]" />
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

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
            <GradientCard variant="highlighted">
              <div className="relative w-full h-[360px] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.png"
                  alt="Generated post"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </GradientCard>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  Caption
                </h3>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <p className="font-medium text-gray-900 mb-2 text-sm">
                    {idea.title}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">
                    {idea.content}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <GradientButton
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Post
                    </>
                  )}
                </GradientButton>

                <div className="relative">
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 text-gray-500">
                      or share directly
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <GradientIconButton
                    variant="ghost"
                    onClick={handleWhatsAppShare}
                    className="flex-col h-auto py-3"
                  >
                    <WhatsAppIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </GradientIconButton>

                  <GradientIconButton
                    variant="ghost"
                    onClick={handleFacebookShare}
                    className="flex-col h-auto py-3"
                  >
                    <FacebookIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </GradientIconButton>

                  <GradientIconButton
                    variant="ghost"
                    onClick={handleInstagramShare}
                    className="flex-col h-auto py-3"
                  >
                    <InstagramIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">Instagram</span>
                  </GradientIconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
