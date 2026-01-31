import { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { GradientButton } from '@/components/common/GradientButton';
import { SocialProfileShareButton } from '@/features/social-accounts/components/SocialProfileShareButton';
import { useSocialAccountsStatus } from '@/features/social-accounts/hooks/useSocialProfile';
import { SocialPlatform } from '@/features/social-accounts/types/socialProfile';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useToast } from '@/components/common/Toast';

interface SocialProfileShareSectionProps {
  onDownload: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
  downloadDisabled: boolean;
  postTitle?: string;
  className?: string;
}

export function SocialProfileShareSection({
  onDownload,
  isDownloading,
  downloadSuccess,
  downloadDisabled,
  postTitle,
  className = '',
}: SocialProfileShareSectionProps) {
  const { data: accountsStatus } = useSocialAccountsStatus();
  const { showToast } = useToast();
  const [sharingPlatform, setSharingPlatform] = useState<SocialPlatform | null>(
    null
  );
  const [confirmSharePlatform, setConfirmSharePlatform] =
    useState<SocialPlatform | null>(null);

  const handleShare = (platform: SocialPlatform) => {
    setConfirmSharePlatform(platform);
  };

  const handleConnect = () => {
    window.open('/social-profiles', '_blank');
  };

  const getPlatformDisplayName = (platform: SocialPlatform): string => {
    const names: Record<SocialPlatform, string> = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      googlebusiness: 'Google My Business',
    };
    return names[platform];
  };

  const handleShareConfirm = async () => {
    if (!confirmSharePlatform) return;

    setSharingPlatform(confirmSharePlatform);

    // TODO: Implement actual API call to share post
    // Placeholder implementation - simulate API call
    setTimeout(() => {
      const platformName = getPlatformDisplayName(confirmSharePlatform);
      showToast(`Successfully shared to ${platformName}!`, 'success');
      setSharingPlatform(null);
      setConfirmSharePlatform(null);
    }, 1500);
  };

  if (!accountsStatus) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <GradientButton
        onClick={onDownload}
        isLoading={isDownloading}
        loadingText="Downloading..."
        disabled={downloadDisabled}
        className="w-full"
      >
        {downloadSuccess ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Post
          </>
        )}
      </GradientButton>

      <div className="relative">
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-gray-500">or share to social media</span>
        </div>
      </div>

      <div className="space-y-2">
        <SocialProfileShareButton
          platform={SocialPlatform.FACEBOOK}
          accountStatus={accountsStatus.facebook}
          onShare={() => handleShare(SocialPlatform.FACEBOOK)}
          onConnect={handleConnect}
          isSharing={sharingPlatform === SocialPlatform.FACEBOOK}
        />
        <SocialProfileShareButton
          platform={SocialPlatform.INSTAGRAM}
          accountStatus={accountsStatus.instagram}
          onShare={() => handleShare(SocialPlatform.INSTAGRAM)}
          onConnect={handleConnect}
          isSharing={sharingPlatform === SocialPlatform.INSTAGRAM}
        />
        <SocialProfileShareButton
          platform={SocialPlatform.GOOGLEBUSINESS}
          accountStatus={accountsStatus.googlebusiness}
          onShare={() => handleShare(SocialPlatform.GOOGLEBUSINESS)}
          onConnect={handleConnect}
          isSharing={sharingPlatform === SocialPlatform.GOOGLEBUSINESS}
        />
      </div>

      <ConfirmationDialog
        isOpen={confirmSharePlatform !== null}
        onClose={() => setConfirmSharePlatform(null)}
        onConfirm={handleShareConfirm}
        title="Share to Social Media?"
        message={`Are you sure you want to share "${postTitle || 'this post'}" to ${confirmSharePlatform ? getPlatformDisplayName(confirmSharePlatform) : ''}?`}
        confirmText="Share Now"
        cancelText="Cancel"
        isLoading={sharingPlatform !== null}
        variant="warning"
      />
    </div>
  );
}
