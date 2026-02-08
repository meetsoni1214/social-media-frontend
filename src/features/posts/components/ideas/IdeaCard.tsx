'use client';

import { useState } from 'react';
import { Check, Pencil, Save, Sparkles, X } from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
} from '@/components/common/GradientCard';
import { GradientButton } from '@/components/common/GradientButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  PostIdea,
  SavedPostIdea,
  UpdatePostIdeaRequest,
} from '@/features/posts/types/post';

interface BaseIdeaCardProps {
  isInProgress: boolean;
}

interface SavedIdeaCardProps extends BaseIdeaCardProps {
  variant: 'saved';
  idea: SavedPostIdea;
  useButtonLabel: string;
  onUse: (ideaId: string) => void;
  onUpdate: (ideaId: string, updates: UpdatePostIdeaRequest) => void;
}

interface NewIdeaCardProps extends BaseIdeaCardProps {
  variant: 'new';
  idea: PostIdea;
  onSave: (idea: PostIdea) => void;
  onDiscard: (ideaId: string) => void;
}

type IdeaCardProps = SavedIdeaCardProps | NewIdeaCardProps;

export function IdeaCard(props: IdeaCardProps) {
  const { variant, idea, isInProgress } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  const startEditing = () => {
    setIsEditing(true);
    setDraftTitle(idea.title);
    setDraftContent(idea.content);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraftTitle('');
    setDraftContent('');
  };

  const saveEdit = () => {
    const title = draftTitle.trim();
    const content = draftContent.trim();

    if (!title || !content) {
      return;
    }

    if (variant === 'saved') {
      props.onUpdate(String(idea.id), { title, content });
    }
    cancelEditing();
  };

  return (
    <GradientCard variant="highlighted">
      <GradientCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--gradient-pink)]" />
            <GradientCardTitle>
              {isEditing ? 'Editing Idea' : idea.title}
            </GradientCardTitle>
          </div>
        </div>
      </GradientCardHeader>

      <div>
        <div className="rounded-lg bg-gray-50 p-4">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={draftTitle}
                onChange={event => setDraftTitle(event.target.value)}
                placeholder="Idea title"
                className="bg-white"
              />
              <Textarea
                value={draftContent}
                onChange={event => setDraftContent(event.target.value)}
                placeholder="Idea content"
                className="min-h-[120px] bg-white"
              />
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-800">
              <p>{idea.content}</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <GradientButton
                size="sm"
                className="flex-1"
                isLoading={isInProgress}
                loadingText="Updating..."
                onClick={saveEdit}
                disabled={!draftTitle.trim() || !draftContent.trim()}
              >
                <Save className="h-4 w-4" />
                Update Idea
              </GradientButton>
              <GradientButton
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={cancelEditing}
              >
                <X className="h-4 w-4" />
                Cancel
              </GradientButton>
            </div>
          ) : variant === 'saved' ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <GradientButton
                size="sm"
                className="flex-1"
                onClick={() => props.onUse(String(idea.id))}
              >
                <Sparkles className="h-4 w-4" />
                {props.useButtonLabel}
              </GradientButton>
              <GradientButton
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={startEditing}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </GradientButton>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <GradientButton
                size="sm"
                className="flex-1"
                isLoading={isInProgress}
                loadingText="Saving..."
                onClick={() => props.onSave(idea)}
              >
                <Check className="h-4 w-4" />
                Save Idea
              </GradientButton>
              <GradientButton
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => props.onDiscard(idea.id)}
              >
                <X className="h-4 w-4" />
                Discard
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </GradientCard>
  );
}
