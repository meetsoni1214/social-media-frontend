'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { BusinessProfileFormData } from '@/lib/validations';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';

interface OnboardingContextType {
  businessProfile: BusinessProfileFormData | null;
  businessProfileId: number | null;
  updateBusinessProfile: (
    data: BusinessProfileFormData,
    profileId?: number
  ) => void;
  resetOnboarding: () => void;
  isBusinessProfileComplete: boolean;
  isLoading: boolean;
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

  const { data: fetchedProfile, isLoading } = useBusinessProfile();

  useEffect(() => {
    if (fetchedProfile) {
      const profileData: BusinessProfileFormData = {
        businessName: fetchedProfile.businessName,
        category: fetchedProfile.category,
        description: fetchedProfile.description,
        targetAudience: fetchedProfile.targetAudience,
        websiteUrl: fetchedProfile.websiteUrl,
        logo: fetchedProfile.logo,
        primaryColor: fetchedProfile.primaryColor,
        secondaryColor: fetchedProfile.secondaryColor,
        accentColor: fetchedProfile.accentColor,
      };
      setBusinessProfile(profileData);
      setBusinessProfileId(fetchedProfile.id);
    }
  }, [fetchedProfile]);

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
        isLoading,
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
