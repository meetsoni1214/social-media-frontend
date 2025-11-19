'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft, Sparkles, Calendar, Loader2 } from 'lucide-react';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
} from '@/components/GradientCard';
import { GradientButton } from '@/components/GradientButton';
import { mockApi, type Festival, type PostIdea } from '@/lib/mockApi';

export default function FestivalPostPage() {
  const router = useRouter();
  const { businessProfile, isBusinessProfileComplete } = useOnboarding();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(
    null
  );
  const [postIdeas, setPostIdeas] = useState<PostIdea[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(true);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push('/business-profile');
      return;
    }

    const loadFestivals = async () => {
      const response = await mockApi.getFestivals();
      if (response.success && response.data) {
        setFestivals(response.data);
      }
      setIsLoadingFestivals(false);
    };

    loadFestivals();
  }, [isBusinessProfileComplete, router]);

  const handleFestivalSelect = async (festival: Festival) => {
    if (!businessProfile) return;

    setSelectedFestival(festival);
    setIsGeneratingIdeas(true);
    setPostIdeas([]);

    const response = await mockApi.generateFestivalPostIdeas(
      festival.id,
      businessProfile
    );

    if (response.success && response.data) {
      setPostIdeas(response.data);
    }
    setIsGeneratingIdeas(false);
  };

  const handleBack = () => {
    if (selectedFestival) {
      setSelectedFestival(null);
      setPostIdeas([]);
    } else {
      router.push('/dashboard');
    }
  };

  if (!businessProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <GradientButton variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            {selectedFestival ? 'Back to Festivals' : 'Back to Dashboard'}
          </GradientButton>
        </div>

        {!selectedFestival ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <Calendar className="w-8 h-8 text-[var(--gradient-pink)]" />
                <h1 className="text-3xl font-bold gradient-text">
                  Festival Posts
                </h1>
              </div>
              <p className="text-lg text-gray-600">
                Select a festival to generate post ideas
              </p>
            </div>

            {isLoadingFestivals ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--gradient-pink)]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {festivals.map(festival => (
                  <button
                    key={festival.id}
                    onClick={() => handleFestivalSelect(festival)}
                    className="text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--gradient-pink)] hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{festival.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[var(--gradient-orange)] to-[var(--gradient-pink)] text-white">
                        {festival.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {festival.date}
                    </p>
                    <p className="text-sm text-gray-700">
                      {festival.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {selectedFestival.name} Post Ideas
              </h1>
              <p className="text-gray-600">{selectedFestival.description}</p>
            </div>

            {isGeneratingIdeas ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--gradient-pink)] mb-4" />
                <p className="text-gray-600">
                  Generating personalized post ideas...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {postIdeas.map((idea, index) => (
                  <GradientCard key={idea.id} variant="highlighted">
                    <GradientCardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-[var(--gradient-pink)]" />
                            <GradientCardTitle>{idea.title}</GradientCardTitle>
                          </div>
                        </div>
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gradient-orange)] to-[var(--gradient-pink)] text-white">
                          Idea {index + 1}
                        </span>
                      </div>
                    </GradientCardHeader>

                    <div className="mt-4">
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {idea.content}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <GradientButton size="sm" className="flex-1">
                          <Sparkles className="w-4 h-4" />
                          Use This Idea
                        </GradientButton>
                      </div>
                    </div>
                  </GradientCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
