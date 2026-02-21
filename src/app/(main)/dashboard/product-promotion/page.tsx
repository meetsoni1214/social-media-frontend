'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessProfileData } from '@/features/business-profile/hooks/useBusinessProfileData';
import { TrendingUp } from 'lucide-react';
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
  useUpdatePostIdea,
} from '@/features/posts/hooks/usePostIdeas';
import type {
  PostIdea,
  PostIdeaType,
  UpdatePostIdeaRequest,
} from '@/features/posts/types/post';

export default function ProductPromotionPage() {
  const router = useRouter();
  const { data } = useBusinessProfileData();
  const businessProfile = data!.businessProfile!;
  const [newIdeas, setNewIdeas] = useState<PostIdea[]>([]);
  const [savingIdeaId, setSavingIdeaId] = useState<string | null>(null);
  const [updatingIdeaId, setUpdatingIdeaId] = useState<string | null>(null);
  const ideaType: PostIdeaType = 'PROMOTIONAL';

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
  const { mutate: updateIdea } = useUpdatePostIdea();

  const savedIdeas = savedPostIdeasResponse || [];

  const handleGenerateIdeas = (ideaCount?: number) => {
    generateIdeas(
      { businessProfile, ideaType, ideaCount },
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

  const handleUpdateIdea = (ideaId: string, updates: UpdatePostIdeaRequest) => {
    setUpdatingIdeaId(ideaId);
    updateIdea(
      {
        ideaId,
        ideaType,
        data: updates,
      },
      {
        onSettled: () => {
          setUpdatingIdeaId(null);
        },
      }
    );
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
            title="Product Promotion Ideas"
            icon={<TrendingUp className="h-9 w-9 text-emerald-600" />}
            description={
              <>
                A Place that shapes campaigns for{' '}
                <span className="font-semibold text-slate-900">
                  {businessProfile.businessName}
                </span>
                . Generate, refine, and save ideas in a single flow.
              </>
            }
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <QuickControls
              description="Create fresh promotional concepts tailored to your business and keep only what feels right."
              onGenerate={handleGenerateIdeas}
              isGenerating={isGenerating}
            />

            <div className="space-y-6">
              <NewIdeasSection
                emptyMessage="Generate a fresh set to start sculpting your next campaign."
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
              emptyMessage='Click "Generate New Ideas" to start building your promotion library.'
              ideas={savedIdeas}
              isLoading={isLoadingSavedPostIdeas}
              updatingIdeaId={updatingIdeaId}
              error={error}
              onRetry={refetch}
              onUpdateIdea={handleUpdateIdea}
              onUseIdea={ideaId =>
                router.push(`/dashboard/product-promotion/${ideaId}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
