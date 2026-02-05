'use client';

import { TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  businessName: string;
}

export function HeroSection({ businessName }: HeroSectionProps) {
  return (
    <div className="mb-10 animate-fade-in">
      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-9 w-9 text-emerald-600" />
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Product Promotion Ideas
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            A Place that shapes campaigns for{' '}
            <span className="font-semibold text-slate-900">{businessName}</span>
            . Generate, refine, and save ideas in a single flow.
          </p>
        </div>
      </div>
    </div>
  );
}
