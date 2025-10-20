"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  BusinessProfileFormData,
  ContentPreferencesFormData,
} from "@/lib/validations";

interface OnboardingContextType {
  businessProfile: BusinessProfileFormData | null;
  contentPreferences: ContentPreferencesFormData | null;
  updateBusinessProfile: (data: BusinessProfileFormData) => void;
  updateContentPreferences: (data: ContentPreferencesFormData) => void;
  resetOnboarding: () => void;
  isBusinessProfileComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfileFormData | null>(null);
  const [contentPreferences, setContentPreferences] =
    useState<ContentPreferencesFormData | null>(null);

  const updateBusinessProfile = (data: BusinessProfileFormData) => {
    setBusinessProfile(data);
  };

  const updateContentPreferences = (data: ContentPreferencesFormData) => {
    setContentPreferences(data);
  };

  const resetOnboarding = () => {
    setBusinessProfile(null);
    setContentPreferences(null);
  };

  const isBusinessProfileComplete = businessProfile !== null;

  return (
    <OnboardingContext.Provider
      value={{
        businessProfile,
        contentPreferences,
        updateBusinessProfile,
        updateContentPreferences,
        resetOnboarding,
        isBusinessProfileComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
