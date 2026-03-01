'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useBusinessProfiles } from '@/features/business-profile/hooks/useBusinessProfileData';
import { GradientCard } from '@/components/common/GradientCard';
import { GradientButton } from '@/components/common/GradientButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorCard } from '@/components/common/ErrorCard';
import { BusinessCard } from '@/features/business-profile/components/BusinessCard';

export default function BusinessesPage() {
  const router = useRouter();
  const { data: businessProfiles, isLoading, error } = useBusinessProfiles();

  if (isLoading) {
    return <LoadingScreen message="Loading your businesses..." />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Unable to load businesses"
        message={
          error.message || 'Something went wrong while loading businesses.'
        }
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text sm:text-3xl">
              Your Businesses
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Select a business to continue.
            </p>
          </div>
          <GradientButton
            className="w-full sm:w-auto"
            onClick={() => router.push('/businesses/new')}
          >
            <Plus className="h-4 w-4" />
            Add Business
          </GradientButton>
        </div>

        {!businessProfiles || businessProfiles.length === 0 ? (
          <GradientCard>
            <p className="text-sm text-gray-600">
              You do not have any business profiles yet.
            </p>
            <div className="mt-4">
              <GradientButton
                className="w-full sm:w-auto"
                onClick={() => router.push('/businesses/new')}
              >
                Create Your First Business
              </GradientButton>
            </div>
          </GradientCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {businessProfiles.map(profile => (
              <BusinessCard
                key={profile.id}
                profile={profile}
                onSelect={businessId => router.push(`/${businessId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
