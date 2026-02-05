'use client';

import { Sparkles } from 'lucide-react';
import {
  GradientCard,
  GradientCardDescription,
  GradientCardHeader,
  GradientCardTitle,
} from '@/components/common/GradientCard';
import { GradientButton } from '@/components/common/GradientButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { SavedPostIdea } from '@/features/posts/types/post';
import { IdeaCard } from './IdeaCard';
import { SectionHeader } from './SectionHeader';

interface SavedIdeasSectionProps {
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyMessage: string;
  useButtonLabel?: string;
  ideas: SavedPostIdea[];
  isLoading: boolean;
  error?: Error | null;
  onRetry: () => void;
  onUseIdea: (ideaId: string) => void;
}

export function SavedIdeasSection({
  title = 'Saved Ideas',
  description = 'Launch an idea into your next post when you are ready.',
  emptyTitle = 'No saved ideas yet',
  emptyMessage,
  useButtonLabel = 'Use This Idea',
  ideas,
  isLoading,
  error,
  onRetry,
  onUseIdea,
}: SavedIdeasSectionProps) {
  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading saved ideas..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <SectionHeader title={title} description={description} />

      {ideas.length === 0 ? (
        <GradientCard variant="highlighted">
          <GradientCardHeader>
            <GradientCardTitle>{emptyTitle}</GradientCardTitle>
            <GradientCardDescription>{emptyMessage}</GradientCardDescription>
          </GradientCardHeader>
        </GradientCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ideas.map(idea => (
            <IdeaCard
              key={idea.id}
              title={idea.title}
              content={idea.content}
              action={
                <div className="flex gap-3">
                  <GradientButton
                    size="sm"
                    className="flex-1"
                    onClick={() => onUseIdea(String(idea.id))}
                  >
                    <Sparkles className="h-4 w-4" />
                    {useButtonLabel}
                  </GradientButton>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
