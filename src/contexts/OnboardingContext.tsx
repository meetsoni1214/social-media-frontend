'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { BusinessProfileFormData } from '@/lib/validations';

interface OnboardingContextType {
  businessProfile: BusinessProfileFormData | null;
  updateBusinessProfile: (data: BusinessProfileFormData) => void;
  resetOnboarding: () => void;
  isBusinessProfileComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfileFormData | null>(null);

  const updateBusinessProfile = (data: BusinessProfileFormData) => {
    setBusinessProfile(data);
  };

  const resetOnboarding = () => {
    setBusinessProfile(null);
  };

  const isBusinessProfileComplete = businessProfile !== null;

  return (
    <OnboardingContext.Provider
      value={{
        businessProfile,
        updateBusinessProfile,
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
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
