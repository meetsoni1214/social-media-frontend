import { useCallback } from 'react';

interface SocialShareOptions {
  onShareAttempt?: (platform: string) => void;
  onError?: (platform: string, error: string) => void;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface UseSocialShareReturn {
  shareToWhatsApp: (data: ShareData) => void;
  shareToFacebook: (data: ShareData) => void;
  shareToInstagram: () => void;
}

export function useSocialShare(
  options: SocialShareOptions = {}
): UseSocialShareReturn {
  const { onShareAttempt, onError } = options;

  const shareToWhatsApp = useCallback(
    (data: ShareData) => {
      try {
        onShareAttempt?.('whatsapp');

        const message = data.text || data.title || 'Check out this post!';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'WhatsApp share failed';
        onError?.('whatsapp', errorMessage);
      }
    },
    [onShareAttempt, onError]
  );

  const shareToFacebook = useCallback(
    (data: ShareData) => {
      try {
        onShareAttempt?.('facebook');

        const shareUrl = data.url || window.location.href;
        const encodedUrl = encodeURIComponent(shareUrl);
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

        window.open(
          facebookUrl,
          '_blank',
          'width=600,height=400,scrollbars=yes,resizable=yes'
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Facebook share failed';
        onError?.('facebook', errorMessage);
      }
    },
    [onShareAttempt, onError]
  );

  const shareToInstagram = useCallback(() => {
    onShareAttempt?.('instagram');

    const message =
      'Please download the image and share it on Instagram manually. Instagram does not support direct web sharing.';

    alert(message);
  }, [onShareAttempt]);

  return {
    shareToWhatsApp,
    shareToFacebook,
    shareToInstagram,
  };
}
