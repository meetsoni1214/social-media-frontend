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
  ideas: SavedPostIdea[];
  isLoading: boolean;
  error?: Error | null;
  onRetry: () => void;
  onUseIdea: (ideaId: string) => void;
}

export function SavedIdeasSection({
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
      <SectionHeader
        title="Saved Ideas"
        description="Launch an idea into your next post when you are ready."
      />

      {ideas.length === 0 ? (
        <GradientCard variant="highlighted">
          <GradientCardHeader>
            <GradientCardTitle>No saved ideas yet</GradientCardTitle>
            <GradientCardDescription>
              Click &quot;Generate New Ideas&quot; to start building your
              promotion library.
            </GradientCardDescription>
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
                <div className="flex justify-center">
                  <GradientButton
                    size="sm"
                    onClick={() => onUseIdea(String(idea.id))}
                  >
                    <Sparkles className="h-4 w-4" />
                    Use This Idea
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
