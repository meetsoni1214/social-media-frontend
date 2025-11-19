import { Download, Loader2, CheckCircle } from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from '@/components/icons/SocialIcons';
import { GradientButton } from '@/components/GradientButton';
import { GradientIconButton } from '@/components/GradientIconButton';

interface ShareActionsProps {
  onDownload: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
  downloadDisabled: boolean;

  onWhatsAppShare: () => void;
  onFacebookShare: () => void;
  onInstagramShare: () => void;

  className?: string;
}

export function ShareActions({
  onDownload,
  isDownloading,
  downloadSuccess,
  downloadDisabled,
  onWhatsAppShare,
  onFacebookShare,
  onInstagramShare,
  className = '',
}: ShareActionsProps) {
  const renderDownloadButtonContent = () => {
    if (isDownloading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Downloading...
        </>
      );
    }

    if (downloadSuccess) {
      return (
        <>
          <CheckCircle className="w-4 h-4" />
          Downloaded!
        </>
      );
    }

    return (
      <>
        <Download className="w-4 h-4" />
        Download Post
      </>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <GradientButton
        onClick={onDownload}
        disabled={isDownloading || downloadDisabled}
        className="w-full"
      >
        {renderDownloadButtonContent()}
      </GradientButton>

      {/* Divider */}
      <div className="relative">
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-gray-500">or share directly</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <GradientIconButton
          variant="ghost"
          onClick={onWhatsAppShare}
          className="flex-col h-auto py-3"
        >
          <WhatsAppIcon className="w-8 h-8 mb-1" />
          <span className="text-xs">WhatsApp</span>
        </GradientIconButton>

        <GradientIconButton
          variant="ghost"
          onClick={onFacebookShare}
          className="flex-col h-auto py-3"
        >
          <FacebookIcon className="w-8 h-8 mb-1" />
          <span className="text-xs">Facebook</span>
        </GradientIconButton>

        <GradientIconButton
          variant="ghost"
          onClick={onInstagramShare}
          className="flex-col h-auto py-3"
        >
          <InstagramIcon className="w-8 h-8 mb-1" />
          <span className="text-xs">Instagram</span>
        </GradientIconButton>
      </div>
    </div>
  );
}
