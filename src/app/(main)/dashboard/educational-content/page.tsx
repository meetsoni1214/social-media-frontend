'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/features/business-profile/contexts/OnboardingContext';
import { BookOpen } from 'lucide-react';
import {
  IdeaStudioHero,
  NewIdeasSection,
  QuickControls,
  SavedIdeasSection,
} from '@/features/posts/components/ideas';
import {
  useGeneratePostIdeas,
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
  } = useGeneratePostIdeas();
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
      { businessProfile, ideaType },
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
    <div className="min-h-screen text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-5xl px-4 pb-16 pt-10">
          <IdeaStudioHero
            title="Educational Content Ideas"
            icon={<BookOpen className="h-9 w-9 text-emerald-600" />}
            description={
              <>
                Share valuable knowledge crafted for{' '}
                <span className="font-semibold text-slate-900">
                  {businessProfile.businessName}
                </span>
                . Generate, refine, and save ideas in a single flow.
              </>
            }
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <QuickControls
              description="Create fresh educational content tailored to your audience and keep only what feels right."
              onGenerate={handleGenerateIdeas}
              isGenerating={isGenerating}
            />

            <div className="space-y-6">
              <NewIdeasSection
                emptyMessage="Generate a fresh set to start shaping your next learning moment."
                ideas={newIdeas}
                isSaving={isSaving}
                savingIdeaId={savingIdeaId}
                onAccept={handleAcceptIdea}
                onDiscard={handleDiscardIdea}
                onRetry={handleGenerateIdeas}
                error={generateError}
              />
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <SavedIdeasSection
              emptyMessage='Click "Generate New Ideas" to start building your educational content library.'
              ideas={savedIdeas}
              isLoading={isLoadingSavedPostIdeas}
              error={error}
              onRetry={refetch}
              onUseIdea={ideaId =>
                router.push(`/dashboard/educational-content/${ideaId}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
