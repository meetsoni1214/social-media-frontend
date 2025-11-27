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
  businessProfileId: number | null;
  updateBusinessProfile: (
    data: BusinessProfileFormData,
    profileId?: number
  ) => void;
  resetOnboarding: () => void;
  isBusinessProfileComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfileFormData | null>(null);
  const [businessProfileId, setBusinessProfileId] = useState<number | null>(
    null
  );

  const updateBusinessProfile = (
    data: BusinessProfileFormData,
    profileId?: number
  ) => {
    setBusinessProfile(data);
    if (profileId !== undefined) {
      setBusinessProfileId(profileId);
    }
  };

  const resetOnboarding = () => {
    setBusinessProfile(null);
    setBusinessProfileId(null);
  };

  const isBusinessProfileComplete = businessProfile !== null;

  return (
    <OnboardingContext.Provider
      value={{
        businessProfile,
        businessProfileId,
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
