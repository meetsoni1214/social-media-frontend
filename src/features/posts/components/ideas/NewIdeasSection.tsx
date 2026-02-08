'use client';

import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { PostIdea } from '@/features/posts/types/post';
import { EmptyState } from './EmptyState';
import { IdeaCard } from './IdeaCard';
import { SectionHeader } from './SectionHeader';

const CARD_SHELL_CLASS =
  'rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur';

interface NewIdeasSectionProps {
  title?: string;
  description?: string;
  emptyMessage: string;
  errorTitle?: string;
  retryLabel?: string;
  ideas: PostIdea[];
  isSaving: boolean;
  savingIdeaId: string | null;
  onAccept: (idea: PostIdea) => void;
  onDiscard: (ideaId: string) => void;
  onRetry: () => void;
  error?: Error | null;
}

export function NewIdeasSection({
  title = 'New Ideas',
  description = 'Review each idea, save the winners, and discard the rest.',
  emptyMessage,
  errorTitle = 'Could not generate new ideas',
  retryLabel = 'Try Generating Again',
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
      <SectionHeader title={title} description={description} />

      <div className="mt-6 space-y-4">
        {error && (
          <ErrorMessage
            title={errorTitle}
            error={error}
            onRetry={onRetry}
            retryLabel={retryLabel}
          />
        )}

        {ideas.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <div className="space-y-4 animate-slide-up">
            {ideas.map(idea => (
              <IdeaCard
                key={idea.id}
                variant="new"
                idea={idea}
                isInProgress={isSaving && savingIdeaId === idea.id}
                onSave={onAccept}
                onDiscard={onDiscard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
