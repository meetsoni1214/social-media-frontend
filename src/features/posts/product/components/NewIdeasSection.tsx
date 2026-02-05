'use client';

import { Check, X } from 'lucide-react';
import { GradientButton } from '@/components/common/GradientButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { PostIdea } from '@/features/posts/types/post';
import { EmptyState } from './EmptyState';
import { IdeaCard } from './IdeaCard';
import { SectionHeader } from './SectionHeader';

const CARD_SHELL_CLASS =
  'rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur';

interface NewIdeasSectionProps {
  ideas: PostIdea[];
  isSaving: boolean;
  savingIdeaId: string | null;
  onAccept: (idea: PostIdea) => void;
  onDiscard: (ideaId: string) => void;
  onRetry: () => void;
  error?: Error | null;
}

export function NewIdeasSection({
  ideas,
  isSaving,
  savingIdeaId,
  onAccept,
  onDiscard,
  onRetry,
  error,
}: NewIdeasSectionProps) {
  return (
    <div className={CARD_SHELL_CLASS}>
      <SectionHeader
        title="New Ideas"
        description="Review each idea, save the winners, and discard the rest."
      />

      <div className="mt-6 space-y-4">
        {error && (
          <ErrorMessage
            title="Could not generate new ideas"
            error={error}
            onRetry={onRetry}
            retryLabel="Try Generating Again"
          />
        )}

        {ideas.length === 0 ? (
          <EmptyState message="Generate a fresh set of ideas." />
        ) : (
          <div className="space-y-4 animate-slide-up">
            {ideas.map(idea => (
              <IdeaCard
                key={idea.id}
                title={idea.title}
                content={idea.content}
                action={
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <GradientButton
                      size="sm"
                      className="flex-1"
                      isLoading={isSaving && savingIdeaId === idea.id}
                      loadingText="Saving..."
                      onClick={() => onAccept(idea)}
                    >
                      <Check className="h-4 w-4" />
                      Save Idea
                    </GradientButton>
                    <GradientButton
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => onDiscard(idea.id)}
                    >
                      <X className="h-4 w-4" />
                      Discard
                    </GradientButton>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
