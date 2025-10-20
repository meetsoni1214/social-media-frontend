"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Sparkles, Building2, Palette, Target } from "lucide-react";
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
} from "@/components/GradientCard";
import { GradientButton } from "@/components/GradientButton";

export default function DashboardPage() {
  const router = useRouter();
  const { businessProfile, contentPreferences, isBusinessProfileComplete } =
    useOnboarding();

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push("/business-profile");
    }
  }, [isBusinessProfileComplete, router]);

  if (!businessProfile || !contentPreferences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-[var(--gradient-pink)]" />
            <h1 className="text-4xl font-bold gradient-text">
              Welcome, {businessProfile.businessName}!
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Your profile is all set up. You&apos;re ready to create amazing
            content!
          </p>
          <GradientButton size="lg" className="text-lg">
            <Sparkles className="w-5 h-5" />
            Create Your First Post
          </GradientButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <GradientCard variant="highlighted">
            <div className="flex items-start gap-3">
              <Building2 className="w-8 h-8 text-[var(--gradient-orange)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Business Details</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {businessProfile.category}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {businessProfile.description}
                </p>
              </div>
            </div>
          </GradientCard>

          <GradientCard variant="highlighted">
            <div className="flex items-start gap-3">
              <Palette className="w-8 h-8 text-[var(--gradient-pink)] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Brand Colors</h3>
                <div className="flex gap-2 mt-3">
                  <div className="flex-1">
                    <div
                      className="w-full h-12 rounded-md border-2 border-gray-200"
                      style={{ backgroundColor: businessProfile.primaryColor }}
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Primary
                    </p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="w-full h-12 rounded-md border-2 border-gray-200"
                      style={{
                        backgroundColor: businessProfile.secondaryColor,
                      }}
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Secondary
                    </p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="w-full h-12 rounded-md border-2 border-gray-200"
                      style={{ backgroundColor: businessProfile.accentColor }}
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Accent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GradientCard>

          <GradientCard variant="highlighted">
            <div className="flex items-start gap-3">
              <Target className="w-8 h-8 text-[var(--gradient-purple)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Primary Goals</h3>
                <p className="text-sm text-gray-600">
                  {contentPreferences.goals.map((goal) => goal).join(", ")}
                </p>
              </div>
            </div>
          </GradientCard>
        </div>

        <div className="mt-12">
          <GradientCard>
            <GradientCardHeader>
              <GradientCardTitle>Quick Actions</GradientCardTitle>
              <GradientCardDescription>
                Get started with these common tasks
              </GradientCardDescription>
            </GradientCardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-[var(--gradient-pink)] transition-all">
                <h4 className="font-medium mb-1">Festival Post</h4>
                <p className="text-sm text-gray-600">
                  Create posts for upcoming holidays
                </p>
              </button>

              <button className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-[var(--gradient-pink)] transition-all">
                <h4 className="font-medium mb-1">Product Promotion</h4>
                <p className="text-sm text-gray-600">
                  Promote your products or services
                </p>
              </button>

              <button className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-[var(--gradient-pink)] transition-all">
                <h4 className="font-medium mb-1">Educational Content</h4>
                <p className="text-sm text-gray-600">
                  Share tips and knowledge with your audience
                </p>
              </button>

              <button className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-[var(--gradient-pink)] transition-all">
                <h4 className="font-medium mb-1">Quote Post</h4>
                <p className="text-sm text-gray-600">
                  Share motivational quotes
                </p>
              </button>
            </div>
          </GradientCard>
        </div>

        <div className="mt-8 text-center">
          <GradientButton
            variant="ghost"
            onClick={() => router.push("/business-profile")}
          >
            Edit Profile Settings
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
