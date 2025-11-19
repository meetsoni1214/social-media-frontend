'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
} from '@/components/GradientCard';
import { GradientButton } from '@/components/GradientButton';
import { useProductPromotionIdeas } from '@/hooks/usePostIdeas';

export default function ProductPromotionPage() {
  const router = useRouter();
  const { businessProfile, contentPreferences, isBusinessProfileComplete } =
    useOnboarding();

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useProductPromotionIdeas({
    businessProfile: businessProfile!,
    contentPreferences: contentPreferences!,
  });

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push('/business-profile');
    }
  }, [isBusinessProfileComplete, router]);

  if (!businessProfile || !contentPreferences) {
    return null;
  }

  const postIdeas = response?.data || [];
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'An unexpected error occurred. Please try again.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <GradientButton
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </GradientButton>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <TrendingUp className="w-8 h-8 text-[var(--gradient-pink)]" />
            <h1 className="text-3xl font-bold gradient-text">
              Product Promotion Ideas
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            AI-generated promotion ideas tailored for{' '}
            {businessProfile.businessName}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              {businessProfile.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              {contentPreferences.goals.join(', ')}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--gradient-pink)] mb-4" />
            <p className="text-gray-600">
              Generating personalized promotion ideas...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <GradientCard variant="highlighted">
              <div className="flex flex-col items-center text-center p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Something went wrong
                </h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <GradientButton onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </GradientButton>
              </div>
            </GradientCard>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {postIdeas.map((idea, index) => (
              <GradientCard key={idea.id} variant="highlighted">
                <GradientCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[var(--gradient-pink)]" />
                        <GradientCardTitle>{idea.title}</GradientCardTitle>
                      </div>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gradient-orange)] to-[var(--gradient-pink)] text-white">
                      Idea {index + 1}
                    </span>
                  </div>
                </GradientCardHeader>

                <div className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {idea.content}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <GradientButton size="sm" className="flex-1">
                      <Sparkles className="w-4 h-4" />
                      Use This Idea
                    </GradientButton>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
