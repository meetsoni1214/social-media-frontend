'use client';

import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
} from '@/components/common/GradientCard';

interface IdeaCardProps {
  title: string;
  content: string;
  action: ReactNode;
}

export function IdeaCard({ title, content, action }: IdeaCardProps) {
  return (
    <GradientCard variant="highlighted">
      <GradientCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--gradient-pink)]" />
            <GradientCardTitle>{title}</GradientCardTitle>
          </div>
        </div>
      </GradientCardHeader>

      <div className="flex flex-col">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-gray-800">{content}</p>
        </div>

        <div className="mt-4 flex">{action}</div>
      </div>
    </GradientCard>
  );
}
