'use client';

import { useState } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { GradientButton } from '@/components/common/GradientButton';
import { Select } from '@/components/ui/select';
import {
  DEFAULT_IDEA_COUNT,
  MAX_IDEA_COUNT,
  MIN_IDEA_COUNT,
} from '@/features/posts/utils/ideaCount';
import { SectionHeader } from './SectionHeader';

const CARD_SHELL_CLASS =
  'rounded-2xl h-fit border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur';

interface QuickControlsProps {
  title?: string;
  description: string;
  buttonLabel?: string;
  onGenerate: (ideaCount?: number) => void;
  isGenerating: boolean;
  creditWarning?: string | null;
}

export function QuickControls({
  title = 'Quick Controls',
  description,
  buttonLabel = 'Generate New Ideas',
  onGenerate,
  isGenerating,
  creditWarning,
}: QuickControlsProps) {
  const [ideaCount, setIdeaCount] = useState(DEFAULT_IDEA_COUNT);

  const handleGenerate = () => {
    onGenerate(ideaCount);
  };

  return (
    <div className={CARD_SHELL_CLASS}>
      <SectionHeader title={title} description={description} />
      <div className="mt-6 space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="idea-count"
            className="block text-xs font-medium text-slate-600"
          >
            Number of ideas
          </label>
          <Select
            id="idea-count"
            value={String(ideaCount)}
            onChange={event => setIdeaCount(Number(event.target.value))}
            disabled={isGenerating}
            className="h-9 rounded-md border-slate-200 bg-white/90 text-slate-800 focus:ring-emerald-500"
          >
            {Array.from(
              { length: MAX_IDEA_COUNT - MIN_IDEA_COUNT + 1 },
              (_, index) => {
                const value = MIN_IDEA_COUNT + index;
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              }
            )}
          </Select>
        </div>
        <GradientButton
          size="sm"
          className="w-full justify-center"
          isLoading={isGenerating}
          loadingText="Generating..."
          onClick={handleGenerate}
        >
          <Sparkles className="h-4 w-4" />
          {buttonLabel}
        </GradientButton>
        {creditWarning ? (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{creditWarning}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
