'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/features/business-profile/contexts/OnboardingContext';
import { BookOpen, Check, Sparkles, X } from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
} from '@/components/common/GradientCard';
import { GradientButton } from '@/components/common/GradientButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  useGenerateEducationalContentIdeas,
  useSavePostIdea,
  useGetSavedPostIdeas,
} from '@/features/posts/hooks/usePostIdeas';
import type { PostIdea, PostIdeaType } from '@/features/posts/types/post';

export default function EducationalContentPage() {
  const router = useRouter();
  const { businessProfile, isBusinessProfileComplete } = useOnboarding();
  const [newIdeas, setNewIdeas] = useState<PostIdea[]>([]);
  const [savingIdeaId, setSavingIdeaId] = useState<string | null>(null);
  const ideaType: PostIdeaType = 'EDUCATIONAL';

  const {
    data: savedPostIdeasResponse,
    isLoading: isLoadingSavedPostIdeas,
    error,
    refetch,
  } = useGetSavedPostIdeas(ideaType);
  const {
    mutate: generateIdeas,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateEducationalContentIdeas();
  const { mutate: saveIdea, isPending: isSaving } = useSavePostIdea();

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push('/business-profile');
    }
  }, [isBusinessProfileComplete, router]);

  const savedIdeas = savedPostIdeasResponse || [];

  if (!businessProfile) {
    return null;
  }

  const handleGenerateIdeas = () => {
    if (!businessProfile) {
      return;
    }

    generateIdeas(
      { businessProfile },
      {
        onSuccess: data => {
          setNewIdeas(data.data);
        },
      }
    );
  };

  const handleAcceptIdea = (idea: PostIdea) => {
    setSavingIdeaId(idea.id);
    saveIdea(
      {
        title: idea.title,
        content: idea.content,
        ideaType,
      },
      {
        onSuccess: () => {
          setNewIdeas(current => current.filter(item => item.id !== idea.id));
          setSavingIdeaId(null);
        },
        onError: () => {
          setSavingIdeaId(null);
        },
      }
    );
  };

  const handleDiscardIdea = (ideaId: string) => {
    setNewIdeas(current => current.filter(item => item.id !== ideaId));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <BookOpen className="w-8 h-8 text-[var(--gradient-pink)]" />
            <h1 className="text-3xl font-bold gradient-text">
              Educational Content Ideas
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Share valuable knowledge with your audience about{' '}
            {businessProfile.category}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              {businessProfile.category}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Saved Ideas</h2>
            <p className="text-sm text-gray-600">
              Get started with your saved ideas or generate new ones.
            </p>
          </div>
          <GradientButton
            size="sm"
            isLoading={isGenerating}
            loadingText="Generating..."
            onClick={handleGenerateIdeas}
          >
            <Sparkles className="w-4 h-4" />
            Generate New Ideas
          </GradientButton>
        </div>

        <div className="mb-10 space-y-4">
          {generateError && (
            <ErrorMessage
              title="Could not generate new ideas"
              error={generateError}
              onRetry={handleGenerateIdeas}
              retryLabel="Try Generating Again"
            />
          )}

          {newIdeas.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              {newIdeas.map(idea => (
                <GradientCard key={idea.id} variant="highlighted">
                  <GradientCardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[var(--gradient-pink)]" />
                        <GradientCardTitle>{idea.title}</GradientCardTitle>
                      </div>
                    </div>
                  </GradientCardHeader>

                  <div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {idea.content}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <GradientButton
                        size="sm"
                        className="flex-1"
                        isLoading={isSaving && savingIdeaId === idea.id}
                        loadingText="Saving..."
                        onClick={() => handleAcceptIdea(idea)}
                      >
                        <Check className="w-4 h-4" />
                        Save Idea
                      </GradientButton>
                      <GradientButton
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => handleDiscardIdea(idea.id)}
                      >
                        <X className="w-4 h-4" />
                        Discard
                      </GradientButton>
                    </div>
                  </div>
                </GradientCard>
              ))}
            </div>
          )}
        </div>

        {isLoadingSavedPostIdeas ? (
          <LoadingSpinner size="lg" message="Loading saved ideas..." />
        ) : error ? (
          <ErrorMessage error={error} onRetry={refetch} />
        ) : (
          <div className="space-y-4 animate-slide-up">
            {savedIdeas.length === 0 ? (
              <GradientCard variant="highlighted">
                <GradientCardHeader>
                  <GradientCardTitle>No saved ideas yet</GradientCardTitle>
                  <GradientCardDescription>
                    Click &quot;Generate New Ideas&quot; to start generating
                    educational content ideas.
                  </GradientCardDescription>
                </GradientCardHeader>
              </GradientCard>
            ) : (
              savedIdeas.map(idea => (
                <GradientCard key={idea.id} variant="highlighted">
                  <GradientCardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[var(--gradient-pink)]" />
                        <GradientCardTitle>{idea.title}</GradientCardTitle>
                      </div>
                    </div>
                  </GradientCardHeader>

                  <div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {idea.content}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <GradientButton
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(
                            `/dashboard/educational-content/${idea.id}`
                          )
                        }
                      >
                        <Sparkles className="w-4 h-4" />
                        Use This Idea
                      </GradientButton>
                    </div>
                  </div>
                </GradientCard>
              ))
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <GradientCard>
            <GradientCardHeader>
              <GradientCardTitle>
                Build Trust Through Education
              </GradientCardTitle>
              <GradientCardDescription>
                Educational content helps establish your brand as an authority
                in {businessProfile.category} and builds lasting relationships
                with your audience
              </GradientCardDescription>
            </GradientCardHeader>
          </GradientCard>
        </div>
      </div>
    </div>
  );
}
