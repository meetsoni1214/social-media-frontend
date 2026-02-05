'use client';

import { Sparkles } from 'lucide-react';
import { GradientButton } from '@/components/common/GradientButton';
import { SectionHeader } from './SectionHeader';

const CARD_SHELL_CLASS =
  'rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur';

interface QuickControlsProps {
  title?: string;
  description: string;
  buttonLabel?: string;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function QuickControls({
  title = 'Quick Controls',
  description,
  buttonLabel = 'Generate New Ideas',
  onGenerate,
  isGenerating,
}: QuickControlsProps) {
  return (
    <div className={CARD_SHELL_CLASS}>
      <SectionHeader title={title} description={description} />
      <div className="mt-6">
        <GradientButton
          size="sm"
          className="w-full justify-center"
          isLoading={isGenerating}
          loadingText="Generating..."
          onClick={onGenerate}
        >
          <Sparkles className="h-4 w-4" />
          {buttonLabel}
        </GradientButton>
      </div>
    </div>
  );
}
