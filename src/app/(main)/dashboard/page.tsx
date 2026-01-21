'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  useSocialProfileExists,
  useCreateSocialProfile,
} from '@/hooks/useSocialProfile';
import {
  Sparkles,
  Building2,
  Palette,
  Target,
  Calendar,
  Megaphone,
  BookOpen,
  Quote,
  ArrowRight,
} from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
} from '@/components/GradientCard';
import { GradientButton } from '@/components/GradientButton';
import { QuickActionCard } from '@/components/QuickActionCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { GradientBar } from '@/components/GradientBar';
import { ErrorText } from '@/components/ErrorText';

export default function DashboardPage() {
  const router = useRouter();
  const { businessProfile, isBusinessProfileComplete, isLoading } =
    useOnboarding();
  const { data: socialProfileData } = useSocialProfileExists();
  const {
    mutate: createSocialProfile,
    isPending: isCreatingProfile,
    isError: isCreateError,
    error: createError,
  } = useCreateSocialProfile();

  useEffect(() => {
    if (!isLoading && !isBusinessProfileComplete) {
      router.push('/business-profile');
    }
  }, [isBusinessProfileComplete, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  if (!businessProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-[var(--gradient-pink)]" />
            <h1 className="text-4xl font-bold gradient-text">
              Welcome, {businessProfile.businessName}!
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Your profile is all set up. You&apos;re ready to create amazing
            content!
          </p>
          <GradientButton size="lg" className="text-lg">
            <Sparkles className="w-5 h-5" />
            Create Your First Post
          </GradientButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <GradientCard variant="highlighted">
            <div className="flex items-start gap-3">
              <Building2 className="w-8 h-8 text-[var(--gradient-orange)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Business Details</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {businessProfile.category}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {businessProfile.description}
                </p>
              </div>
            </div>
          </GradientCard>

          <GradientCard variant="highlighted">
            <div className="flex items-start gap-3">
              <Palette className="w-8 h-8 text-[var(--gradient-pink)] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Brand Colors</h3>
                <div className="flex gap-2 mt-3">
                  <div className="flex-1">
                    <div
                      className="w-full h-12 rounded-md border-2 border-gray-200"
                      style={{ backgroundColor: businessProfile.primaryColor }}
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Primary
                    </p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="w-full h-12 rounded-md border-2 border-gray-200"
                      style={{
                        backgroundColor: businessProfile.secondaryColor,
                      }}
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Secondary
                    </p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="w-full h-12 rounded-md border-2 border-gray-200"
                      style={{ backgroundColor: businessProfile.accentColor }}
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Accent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GradientCard>

          <GradientCard variant="highlighted">
            <div className="flex items-start gap-3">
              <Target className="w-8 h-8 text-[var(--gradient-purple)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Target Audience</h3>
                <p className="text-sm text-gray-600">
                  {businessProfile.targetAudience || 'Not specified'}
                </p>
              </div>
            </div>
          </GradientCard>
        </div>

        {connectSocialAccountsCard()}

        <div className="mt-12">
          <GradientCard>
            <GradientCardHeader>
              <GradientCardTitle>Quick Actions</GradientCardTitle>
              <GradientCardDescription>
                Get started with these common tasks
              </GradientCardDescription>
            </GradientCardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <QuickActionCard
                icon={Calendar}
                title="Festival Post"
                description="Create posts for upcoming holidays"
                onClick={() => router.push('/dashboard/festival-post')}
              />

              <QuickActionCard
                icon={Megaphone}
                title="Product Promotion"
                description="Promote your products or services"
                onClick={() => router.push('/dashboard/product-promotion')}
              />

              <QuickActionCard
                icon={BookOpen}
                title="Educational Content"
                description="Share tips and knowledge with your audience"
                onClick={() => router.push('/dashboard/educational-content')}
              />

              <QuickActionCard
                icon={Quote}
                title="Quote Post"
                description="Share motivational quotes"
                onClick={() => router.push('/dashboard/quote-post')}
              />
            </div>
          </GradientCard>
        </div>
      </div>
    </div>
  );

  function connectSocialAccountsCard() {
    const hasSocialProfileCreated = socialProfileData?.exists;

    const handleButtonClick = () => {
      if (hasSocialProfileCreated) {
        router.push('/social-profiles');
      } else {
        createSocialProfile(undefined, {
          onSuccess: () => {
            router.push('/social-profiles');
          },
        });
      }
    };

    return (
      <div className="animate-slide-up mt-8">
        <GradientCard
          variant="highlighted"
          className="relative overflow-hidden"
        >
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold gradient-text mb-2">
                {hasSocialProfileCreated
                  ? 'Manage Your Social Accounts'
                  : 'Connect Your Social Accounts'}
              </h2>
              <p className="text-gray-600 mb-3">
                {hasSocialProfileCreated
                  ? 'View and manage your Instagram, Facebook, and Google My Business accounts at one place.'
                  : 'Link your Instagram, Facebook, and Google My Business accounts to start sharing your content across all platforms with one click.'}
              </p>
              {isCreateError && (
                <ErrorText
                  error={createError}
                  message="Failed to create social profile. Please try again."
                  className="mt-2"
                />
              )}
            </div>

            <div className="flex-shrink-0">
              <GradientButton
                size="lg"
                className="text-lg shadow-xl hover:shadow-2xl transition-all"
                onClick={handleButtonClick}
                disabled={isCreatingProfile}
              >
                {isCreatingProfile
                  ? 'Creating Profile...'
                  : hasSocialProfileCreated
                    ? 'Manage Accounts'
                    : 'Connect Now'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </GradientButton>
            </div>
          </div>
        </GradientCard>
      </div>
    );
  }
}
