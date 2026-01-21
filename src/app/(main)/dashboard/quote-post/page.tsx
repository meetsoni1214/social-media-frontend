'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/features/business-profile/contexts/OnboardingContext';
import { ArrowLeft, Quote as QuoteIcon, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GradientCard } from '@/components/common/GradientCard';
import { GradientButton } from '@/components/common/GradientButton';
import { mockApi, type Quote } from '@/lib/mockApi';
import { GradientBar } from '@/components/common/GradientBar';

export default function QuotePostPage() {
  const router = useRouter();
  const { businessProfile, isBusinessProfileComplete } = useOnboarding();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push('/business-profile');
      return;
    }

    const loadQuotes = async () => {
      const response = await mockApi.getQuotes();
      if (response.success && response.data) {
        setQuotes(response.data);
      }
      setIsLoading(false);
    };

    loadQuotes();
  }, [isBusinessProfileComplete, router]);

  if (!businessProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <GradientButton
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </GradientButton>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <QuoteIcon className="w-10 h-10 text-[var(--gradient-pink)]" />
            <h1 className="text-4xl font-bold gradient-text">Quote Posts</h1>
          </div>
          <p className="text-xl text-gray-600">
            Inspire your audience with these motivational quotes
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner size="md" className="py-12" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
            {quotes.map(quote => (
              <GradientCard key={quote.id} variant="highlighted">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="mb-4">
                      <QuoteIcon
                        className="w-8 h-8 text-[var(--gradient-pink)] mb-3"
                        style={{ opacity: 0.6 }}
                      />
                      <p className="text-xl font-medium text-gray-800 mb-3 leading-relaxed">
                        &quot;{quote.text}&quot;
                      </p>
                      <p className="text-sm font-semibold gradient-text">
                        — {quote.author}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 border border-pink-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Suggested use:</span>{' '}
                        {quote.context}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <GradientButton size="sm" className="flex-1">
                        <Sparkles className="w-4 h-4" />
                        Use This Quote
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
