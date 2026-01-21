'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/features/business-profile/contexts/OnboardingContext';
import { ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
} from '@/components/common/GradientCard';
import { GradientButton } from '@/components/common/GradientButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GradientBar } from '@/components/common/GradientBar';
import { useProductPromotionIdeas } from '@/features/posts/hooks/usePostIdeas';

export default function ProductPromotionPage() {
  const router = useRouter();
  const { businessProfile, isBusinessProfileComplete } = useOnboarding();

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useProductPromotionIdeas({
    businessProfile: businessProfile!,
  });

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push('/business-profile');
    }
  }, [isBusinessProfileComplete, router]);

  if (!businessProfile) {
    return null;
  }

  const postIdeas = response?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />

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
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner
            size="lg"
            message="Generating personalized promotion ideas..."
          />
        ) : error ? (
          <ErrorMessage error={error} onRetry={refetch} />
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
