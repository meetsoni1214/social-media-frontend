'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessProfileDataById } from '@/features/business-profile/hooks/useBusinessProfileData';
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
  useUpdatePostIdea,
} from '@/features/posts/hooks/usePostIdeas';
import type {
  PostIdea,
  PostIdeaType,
  UpdatePostIdeaRequest,
} from '@/features/posts/types/post';
import { uuidSchema } from '@/lib/utils/validation';
import type { UUID } from '@/types/uuid';
import { businessEducationalIdeaRoute } from '@/lib/routes/business';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorCard } from '@/components/common/ErrorCard';
import { InsufficientCreditsError } from '@/lib/api';
import { useToast } from '@/components/common/Toast';
import { buildInsufficientCreditsMessage } from '@/features/posts/utils/credits';

export default function EducationalContentPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const hasValidBusinessId = uuidSchema.safeParse(businessId).success;
  const businessProfileId = hasValidBusinessId ? (businessId as UUID) : null;
  const { data, isLoading: isBusinessLoading } =
    useBusinessProfileDataById(businessProfileId);
  const businessProfile = data?.businessProfile;
  const [newIdeas, setNewIdeas] = useState<PostIdea[]>([]);
  const [savingIdeaId, setSavingIdeaId] = useState<string | null>(null);
  const [updatingIdeaId, setUpdatingIdeaId] = useState<string | null>(null);
  const [creditWarning, setCreditWarning] = useState<string | null>(null);
  const ideaType: PostIdeaType = 'EDUCATIONAL';

  const {
    data: savedPostIdeasResponse,
    isLoading: isLoadingSavedPostIdeas,
    error,
    refetch,
  } = useGetSavedPostIdeas(businessProfileId, ideaType);
  const {
    mutate: generateIdeas,
    isPending: isGenerating,
    error: generateError,
  } = useGeneratePostIdeas();
  const { mutate: saveIdea, isPending: isSaving } = useSavePostIdea();
  const { mutate: updateIdea } = useUpdatePostIdea();

  if (!hasValidBusinessId || !businessProfileId) {
    return (
      <ErrorCard
        title="Invalid business id"
        message="Business context is invalid. Please select a business again."
        actionLabel="Go to Businesses"
        onAction={() => router.push('/businesses')}
      />
    );
  }

  if (isBusinessLoading || !businessProfile) {
    return <LoadingScreen message="Loading your business..." />;
  }

  const savedIdeas = savedPostIdeasResponse || [];

  const handleGenerateIdeas = (ideaCount?: number) => {
    generateIdeas(
      {
        businessProfileId: businessProfileId,
        businessProfile,
        ideaType,
        ideaCount,
      },
      {
        onSuccess: data => {
          setCreditWarning(null);
          setNewIdeas(data.data);
        },
        onError: error => {
          if (!(error instanceof InsufficientCreditsError)) {
            return;
          }

          const message = buildInsufficientCreditsMessage(error.detail);
          setCreditWarning(message);
          showToast(message, 'error');
        },
      }
    );
  };

  const handleAcceptIdea = (idea: PostIdea) => {
    setSavingIdeaId(idea.id);
    saveIdea(
      {
        businessProfileId: businessProfileId,
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
        businessProfileId: businessProfileId,
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
              creditWarning={creditWarning}
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
              updatingIdeaId={updatingIdeaId}
              error={error}
              onRetry={refetch}
              onUpdateIdea={handleUpdateIdea}
              onUseIdea={ideaId =>
                router.push(
                  businessEducationalIdeaRoute(businessProfileId, ideaId)
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
