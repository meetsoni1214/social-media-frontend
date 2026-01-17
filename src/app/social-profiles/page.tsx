'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocialAccountsStatus } from '@/hooks/useSocialProfile';
import { SocialAccountCard } from '@/components/SocialAccountCard';
import {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
} from '@/components/GradientCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorCard } from '@/components/ErrorCard';
import { ArrowLeft, Link2 } from 'lucide-react';
import { GradientButton } from '@/components/GradientButton';
import { GradientBar } from '@/components/GradientBar';
import { SocialPlatform } from '@/types/socialProfile';

export default function SocialProfilesPage() {
  const router = useRouter();
  const { data: accountsStatus, isLoading, error } = useSocialAccountsStatus();
  const [connectingPlatform, setConnectingPlatform] =
    useState<SocialPlatform | null>(null);

  const handleConnect = async (platform: SocialPlatform) => {
    setConnectingPlatform(platform);
    // TODO: Implement actual connection flow
    // This will likely redirect to OAuth URL from useConnectSocialProfile
    console.log(`Connecting to ${platform}...`);

    // Example: Use the connect hook when ready
    // const { data } = await connectMutation.mutateAsync({ platform });
    // if (data?.authorizationUrl) {
    //   window.location.href = data.authorizationUrl;
    // }

    // Reset after some time (remove this in actual implementation)
    setTimeout(() => {
      setConnectingPlatform(null);
    }, 2000);
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    // TODO: Implement disconnect functionality
    console.log(`Disconnecting from ${platform}...`);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading social accounts..." />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Failed to Load Social Accounts"
        error={error}
        message={
          error.message || 'An error occurred while loading your accounts'
        }
        actionLabel="Back to Dashboard"
        onAction={() => router.push('/dashboard')}
      />
    );
  }

  if (!accountsStatus) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-6 animate-fade-in">
          <GradientButton
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </GradientButton>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Link2 className="w-10 h-10 text-[var(--gradient-pink)]" />
            <h1 className="text-4xl font-bold gradient-text">
              Social Accounts
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Connect your social media accounts to start sharing content
          </p>
        </div>

        {(accountsStatus.facebook.isConnected ||
          accountsStatus.instagram.isConnected ||
          accountsStatus.googlebusiness.isConnected) && (
          <div className="mb-12 animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Connected Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accountsStatus.facebook.isConnected && (
                <SocialAccountCard
                  platform={SocialPlatform.FACEBOOK}
                  accountStatus={accountsStatus.facebook}
                  onConnect={() => handleConnect(SocialPlatform.FACEBOOK)}
                  onDisconnect={() => handleDisconnect(SocialPlatform.FACEBOOK)}
                  isConnecting={connectingPlatform === SocialPlatform.FACEBOOK}
                />
              )}
              {accountsStatus.instagram.isConnected && (
                <SocialAccountCard
                  platform={SocialPlatform.INSTAGRAM}
                  accountStatus={accountsStatus.instagram}
                  onConnect={() => handleConnect(SocialPlatform.INSTAGRAM)}
                  onDisconnect={() =>
                    handleDisconnect(SocialPlatform.INSTAGRAM)
                  }
                  isConnecting={connectingPlatform === SocialPlatform.INSTAGRAM}
                />
              )}
              {accountsStatus.googlebusiness.isConnected && (
                <SocialAccountCard
                  platform={SocialPlatform.GOOGLEBUSINESS}
                  accountStatus={accountsStatus.googlebusiness}
                  onConnect={() => handleConnect(SocialPlatform.GOOGLEBUSINESS)}
                  onDisconnect={() =>
                    handleDisconnect(SocialPlatform.GOOGLEBUSINESS)
                  }
                  isConnecting={
                    connectingPlatform === SocialPlatform.GOOGLEBUSINESS
                  }
                />
              )}
            </div>
          </div>
        )}

        {(!accountsStatus.facebook.isConnected ||
          !accountsStatus.instagram.isConnected ||
          !accountsStatus.googlebusiness.isConnected) && (
          <div className="mb-12 animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Connect Your Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!accountsStatus.facebook.isConnected && (
                <SocialAccountCard
                  platform={SocialPlatform.FACEBOOK}
                  accountStatus={accountsStatus.facebook}
                  onConnect={() => handleConnect(SocialPlatform.FACEBOOK)}
                  onDisconnect={() => handleDisconnect(SocialPlatform.FACEBOOK)}
                  isConnecting={connectingPlatform === SocialPlatform.FACEBOOK}
                />
              )}
              {!accountsStatus.instagram.isConnected && (
                <SocialAccountCard
                  platform={SocialPlatform.INSTAGRAM}
                  accountStatus={accountsStatus.instagram}
                  onConnect={() => handleConnect(SocialPlatform.INSTAGRAM)}
                  onDisconnect={() =>
                    handleDisconnect(SocialPlatform.INSTAGRAM)
                  }
                  isConnecting={connectingPlatform === SocialPlatform.INSTAGRAM}
                />
              )}
              {!accountsStatus.googlebusiness.isConnected && (
                <SocialAccountCard
                  platform={SocialPlatform.GOOGLEBUSINESS}
                  accountStatus={accountsStatus.googlebusiness}
                  onConnect={() => handleConnect(SocialPlatform.GOOGLEBUSINESS)}
                  onDisconnect={() =>
                    handleDisconnect(SocialPlatform.GOOGLEBUSINESS)
                  }
                  isConnecting={
                    connectingPlatform === SocialPlatform.GOOGLEBUSINESS
                  }
                />
              )}
            </div>
          </div>
        )}

        {renderWhyConnectSocialAccounts()}
      </div>
    </div>
  );

  function renderWhyConnectSocialAccounts() {
    return (
      <div className="mt-12 animate-slide-up">
        <GradientCard>
          <GradientCardHeader>
            <GradientCardTitle>Why Connect Your Accounts?</GradientCardTitle>
            <GradientCardDescription>
              Connecting your social media accounts allows you to:
            </GradientCardDescription>
          </GradientCardHeader>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[var(--gradient-pink)] mt-0.5">✓</span>
              <span>
                Share content directly to multiple platforms with one click
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--gradient-pink)] mt-0.5">✓</span>
              <span>
                Maintain consistent branding across all your social channels
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--gradient-pink)] mt-0.5">✓</span>
              <span>
                Schedule posts and manage your content calendar efficiently
                (coming soon!)
              </span>
            </li>
          </ul>
        </GradientCard>
      </div>
    );
  }
}
