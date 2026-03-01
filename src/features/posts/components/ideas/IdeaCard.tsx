'use client';

import { useState, type ReactNode } from 'react';
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

interface IdeaCardAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}

const ACTIONS_CONTAINER_CLASS = 'flex flex-col gap-3 sm:flex-row sm:flex-wrap';
const ACTION_BUTTON_CLASS =
  'w-full whitespace-normal sm:min-w-[11rem] sm:flex-1';

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
      props.onUpdate(idea.id, { title, content });
    }
    cancelEditing();
  };

  const renderActions = (actions: IdeaCardAction[]) => {
    return (
      <div className={ACTIONS_CONTAINER_CLASS}>
        {actions.map(action => (
          <GradientButton
            key={action.key}
            size="sm"
            variant={action.variant}
            className={ACTION_BUTTON_CLASS}
            isLoading={action.isLoading}
            loadingText={action.loadingText}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
            {action.label}
          </GradientButton>
        ))}
      </div>
    );
  };

  let actions: IdeaCardAction[];

  if (isEditing) {
    actions = [
      {
        key: 'update',
        label: 'Update Idea',
        icon: <Save className="h-4 w-4" />,
        onClick: saveEdit,
        isLoading: isInProgress,
        loadingText: 'Updating...',
        disabled: !draftTitle.trim() || !draftContent.trim(),
      },
      {
        key: 'cancel',
        label: 'Cancel',
        icon: <X className="h-4 w-4" />,
        onClick: cancelEditing,
        variant: 'secondary',
      },
    ];
  } else if (variant === 'saved') {
    actions = [
      {
        key: 'use',
        label: props.useButtonLabel,
        icon: <Sparkles className="h-4 w-4" />,
        onClick: () => props.onUse(idea.id),
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: <Pencil className="h-4 w-4" />,
        onClick: startEditing,
        variant: 'secondary',
      },
    ];
  } else {
    actions = [
      {
        key: 'save',
        label: 'Save Idea',
        icon: <Check className="h-4 w-4" />,
        onClick: () => props.onSave(idea),
        isLoading: isInProgress,
        loadingText: 'Saving...',
      },
      {
        key: 'discard',
        label: 'Discard',
        icon: <X className="h-4 w-4" />,
        onClick: () => props.onDiscard(idea.id),
        variant: 'secondary',
      },
    ];
  }

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

        <div className="mt-4">{renderActions(actions)}</div>
      </div>
    </GradientCard>
  );
}
