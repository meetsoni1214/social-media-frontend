'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsBusinessProfileComplete } from '@/features/business-profile/hooks/useBusinessProfileData';
import { LoadingScreen } from '@/components/common/LoadingScreen';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: isComplete, isLoading } = useIsBusinessProfileComplete();

  useEffect(() => {
    if (!isLoading && isComplete === false) {
      router.push('/business-profile');
    }
  }, [isComplete, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  if (!isComplete) {
    return null;
  }

  return <>{children}</>;
}
