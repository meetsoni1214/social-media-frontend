'use client';

import type { ReactNode } from 'react';

interface IdeaHeroSectionProps {
  title: string;
  description: ReactNode;
  icon: ReactNode;
}

export function IdeaHeroSection({
  title,
  description,
  icon,
}: IdeaHeroSectionProps) {
  return (
    <div className="mb-10 animate-fade-in">
      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {icon}
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
