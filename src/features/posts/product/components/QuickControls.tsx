'use client';

import { Sparkles } from 'lucide-react';
import { GradientButton } from '@/components/common/GradientButton';
import { SectionHeader } from './SectionHeader';

const CARD_SHELL_CLASS =
  'rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur';

type QuickControlsProps = {
  onGenerate: () => void;
  isGenerating: boolean;
};

export function QuickControls({
  onGenerate,
  isGenerating,
}: QuickControlsProps) {
  return (
    <div className={CARD_SHELL_CLASS}>
      <SectionHeader
        title="Quick Controls"
        description="Create fresh promotional concepts tailored to your business and keep only what feels right."
      />
      <div className="mt-6">
        <GradientButton
          size="sm"
          className="w-full justify-center"
          isLoading={isGenerating}
          loadingText="Generating..."
          onClick={onGenerate}
        >
          <Sparkles className="h-4 w-4" />
          Generate New Ideas
        </GradientButton>
      </div>
    </div>
  );
}
