import * as React from 'react';
import { GradientButton } from '@/components/common/GradientButton';
import { cn } from '@/lib/utils/cn';
import {
  SocialAccountStatus,
  SocialPlatform,
} from '@/features/social-accounts/types/socialProfile';
import {
  FacebookIcon,
  InstagramIcon,
  GoogleMyBusinessIcon,
} from '@/components/icons/SocialIcons';
import { ExternalLink, Share2 } from 'lucide-react';

interface SocialProfileShareCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  platform: SocialPlatform;
  accountStatus: SocialAccountStatus;
  onShare?: () => void;
  onConnect?: () => void;
  isSharing?: boolean;
}

const platformConfig = {
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
  },
  googlebusiness: {
    name: 'Google Business',
    icon: GoogleMyBusinessIcon,
  },
} as const;

const SocialProfileShareCard = React.forwardRef<
  HTMLDivElement,
  SocialProfileShareCardProps
>(
  (
    {
      platform,
      accountStatus,
      onShare,
      onConnect,
      isSharing = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = platformConfig[platform];
    const Icon = config.icon;
    const isConnected = accountStatus.isConnected;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
          isConnected
            ? 'bg-white border-gray-200 hover:border-[var(--gradient-pink)] hover:shadow-sm'
            : 'bg-gray-50 border-gray-100',
          className
        )}
        {...props}
      >
        <div className="flex-shrink-0">
          <Icon className={cn('w-8 h-8', !isConnected && 'opacity-40')} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-medium text-sm',
              isConnected ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            {config.name}
          </p>
          {isConnected && accountStatus.displayName && (
            <p className="text-xs text-gray-600 truncate">
              {accountStatus.displayName}
            </p>
          )}
          {!isConnected && (
            <p className="text-xs text-gray-500">Not connected</p>
          )}
        </div>

        {isConnected ? (
          <GradientButton
            variant="primary"
            size="sm"
            onClick={onShare}
            isLoading={isSharing}
            loadingText="Sharing..."
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </GradientButton>
        ) : (
          <GradientButton variant="ghost" size="sm" onClick={onConnect}>
            <ExternalLink className="w-3.5 h-3.5" />
            Connect
          </GradientButton>
        )}
      </div>
    );
  }
);

SocialProfileShareCard.displayName = 'SocialProfileShareButton';

export { SocialProfileShareCard as SocialProfileShareButton };
