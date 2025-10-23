"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import {
  contentPreferencesSchema,
  type ContentPreferencesFormData,
} from "@/lib/validations";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { mockApi } from "@/lib/mockApi";
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
} from "@/components/GradientCard";
import { GradientButton } from "@/components/GradientButton";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const GOAL_OPTIONS = [
  {
    value: "brand_awareness",
    label: "Brand Awareness",
    icon: "🎯",
    description: "Get your brand noticed",
  },
  {
    value: "engagement",
    label: "Engagement",
    icon: "💬",
    description: "Drive conversations",
  },
  {
    value: "sales",
    label: "Sales/Conversions",
    icon: "💰",
    description: "Convert to customers",
  },
  {
    value: "education",
    label: "Education",
    icon: "📚",
    description: "Inform your audience",
  },
  {
    value: "community",
    label: "Community Building",
    icon: "👥",
    description: "Build loyal following",
  },
];

export default function ContentPreferencesPage() {
  const router = useRouter();
  const {
    updateContentPreferences,
    contentPreferences,
    businessProfile,
    isBusinessProfileComplete,
  } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    contentPreferences?.goals || []
  );

  useEffect(() => {
    if (!isBusinessProfileComplete) {
      router.push("/business-profile");
    }
  }, [isBusinessProfileComplete, router]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContentPreferencesFormData>({
    resolver: zodResolver(contentPreferencesSchema),
    defaultValues: contentPreferences || {
      goals: [],
    },
  });

  const toggleGoal = (goal: string) => {
    const newGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(newGoals);
    setValue("goals", newGoals);
  };

  const onSubmit = async (data: ContentPreferencesFormData) => {
    if (!businessProfile) return;

    setIsLoading(true);
    try {
      await mockApi.saveContentPreferences(data);
      await mockApi.completeOnboarding({
        businessProfile,
        contentPreferences: data,
      });
      updateContentPreferences(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving content preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isBusinessProfileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Content Preferences
          </h1>
          <p className="text-gray-600">
            Define your content style and objectives
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GradientCard>
            <GradientCardHeader>
              <GradientCardTitle className="flex items-center gap-2">
                Primary Goals
              </GradientCardTitle>
            </GradientCardHeader>

            <div className="space-y-3">
              <Label>
                What do you want to achieve with your content? (Select at least
                one) *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleGoal(option.value)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left",
                      selectedGoals.includes(option.value)
                        ? "border-[var(--gradient-pink)] bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {selectedGoals.includes(option.value) && (
                      <CheckCircle2 className="w-5 h-5 text-[var(--gradient-pink)] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              {errors.goals && (
                <p className="text-sm text-red-500">{errors.goals.message}</p>
              )}
            </div>
          </GradientCard>

          <div className="flex items-center justify-between">
            <GradientButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => router.push("/business-profile")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </GradientButton>
            <GradientButton type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Completing Setup..." : "Complete Setup"}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}
