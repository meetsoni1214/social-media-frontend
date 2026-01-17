import * as React from 'react';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import { cn } from '@/lib/utils';
import { SocialAccountStatus, SocialPlatform } from '@/types/socialProfile';
import {
  FacebookIcon,
  InstagramIcon,
  GoogleMyBusinessIcon,
} from './icons/SocialIcons';
import { ExternalLink, Unplug } from 'lucide-react';
import Image from 'next/image';

export interface SocialAccountCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  platform: SocialPlatform;
  accountStatus: SocialAccountStatus;
  onConnect?: () => void;
  onDisconnect?: () => void;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
}

const platformConfig = {
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    color: 'text-[#1877F2]',
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    color: 'text-[#E1306C]',
  },
  googlebusiness: {
    name: 'Google Business',
    icon: GoogleMyBusinessIcon,
    color: 'text-[#4285F4]',
  },
} as const;

const SocialAccountCard = React.forwardRef<
  HTMLDivElement,
  SocialAccountCardProps
>(
  (
    {
      platform,
      accountStatus,
      onConnect,
      onDisconnect,
      isConnecting = false,
      isDisconnecting = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = platformConfig[platform];
    const Icon = config.icon;
    const isConnected = accountStatus.isConnected;

    return (
      <GradientCard
        ref={ref}
        variant={isConnected ? 'highlighted' : 'default'}
        className={cn('transition-all duration-300', className)}
        {...props}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Icon className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {config.name}
                </h3>
              </div>
            </div>
          </div>

          {isConnected && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {accountStatus.profileImageUrl && (
                  <Image
                    src={accountStatus.profileImageUrl}
                    alt={
                      accountStatus.displayName ||
                      accountStatus.username ||
                      `${config.name} Profile`
                    }
                    className="rounded-full border border-gray-200"
                    width={32}
                    height={32}
                  />
                )}
                <div className="flex-1 min-w-0">
                  {accountStatus.displayName && (
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {accountStatus.displayName}
                    </p>
                  )}
                  {accountStatus.username && (
                    <p className="text-xs text-gray-600 truncate">
                      @{accountStatus.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!isConnected ? (
              <GradientButton
                variant="primary"
                size="sm"
                className="w-full"
                onClick={onConnect}
                isLoading={isConnecting}
                loadingText="Connecting..."
              >
                <ExternalLink className="w-4 h-4" />
                Connect Account
              </GradientButton>
            ) : (
              <GradientButton
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={onDisconnect}
                isLoading={isDisconnecting}
                loadingText="Disconnecting..."
              >
                <Unplug className="w-4 h-4" />
                Disconnect
              </GradientButton>
            )}
          </div>
        </div>
      </GradientCard>
    );
  }
);

SocialAccountCard.displayName = 'SocialAccountCard';

export { SocialAccountCard };
