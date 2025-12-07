'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { BusinessProfileFormData } from '@/lib/validations';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';

interface OnboardingContextType {
  businessProfile: BusinessProfileFormData | null;
  businessProfileId: number | null;
  resetOnboarding: () => void;
  isBusinessProfileComplete: boolean;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { data: fetchedProfiles, isLoading } = useBusinessProfile();

  // Derive businessProfile directly from query data - eliminates race condition
  const businessProfile = useMemo<BusinessProfileFormData | null>(() => {
    if (fetchedProfiles && fetchedProfiles.length > 0) {
      const fetchedProfile = fetchedProfiles[0];
      return {
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
    }
    return null;
  }, [fetchedProfiles]);

  const businessProfileId = useMemo<number | null>(() => {
    if (fetchedProfiles && fetchedProfiles.length > 0) {
      return fetchedProfiles[0].id;
    }
    return null;
  }, [fetchedProfiles]);

  const resetOnboarding = () => {
    // This would typically invalidate the query cache
    // For now, it's a placeholder
    console.warn(
      'resetOnboarding called - implement query invalidation if needed'
    );
  };

  const isBusinessProfileComplete = businessProfile !== null;

  return (
    <OnboardingContext.Provider
      value={{
        businessProfile,
        businessProfileId,
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
