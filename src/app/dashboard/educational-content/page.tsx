"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ArrowLeft, BookOpen, Sparkles, Loader2 } from "lucide-react";
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
} from "@/components/GradientCard";
import { GradientButton } from "@/components/GradientButton";
import { mockApi, type PostIdea } from "@/lib/mockApi";

export default function EducationalContentPage() {
  const router = useRouter();
  const { businessProfile, contentPreferences, isBusinessProfileComplete } =
    useOnboarding();
  const [postIdeas, setPostIdeas] = useState<PostIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push("/business-profile");
      return;
    }

    const loadPostIdeas = async () => {
      if (!businessProfile || !contentPreferences) return;

      const response = await mockApi.generateEducationalContentIdeas(
        businessProfile,
        contentPreferences
      );

      if (response.success && response.data) {
        setPostIdeas(response.data);
      }
      setIsLoading(false);
    };

    loadPostIdeas();
  }, [isBusinessProfileComplete, businessProfile, contentPreferences, router]);

  if (!businessProfile || !contentPreferences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <GradientButton
            variant="ghost"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </GradientButton>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <BookOpen className="w-8 h-8 text-[var(--gradient-pink)]" />
            <h1 className="text-3xl font-bold gradient-text">
              Educational Content Ideas
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Share valuable knowledge with your audience about{" "}
            {businessProfile.category}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              {businessProfile.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              Focus: {contentPreferences.goals.join(", ")}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--gradient-pink)] mb-4" />
            <p className="text-gray-600">
              Generating educational content ideas...
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
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

                  <div className="flex gap-3">
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

        <div className="mt-12 text-center">
          <GradientCard>
            <GradientCardHeader>
              <GradientCardTitle>
                Build Trust Through Education
              </GradientCardTitle>
              <GradientCardDescription>
                Educational content helps establish your brand as an authority
                in {businessProfile.category} and builds lasting relationships
                with your audience
              </GradientCardDescription>
            </GradientCardHeader>
          </GradientCard>
        </div>
      </div>
    </div>
  );
}
