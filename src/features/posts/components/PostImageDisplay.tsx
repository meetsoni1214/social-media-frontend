import Image from 'next/image';
import { useState } from 'react';
import { Expand } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { ErrorText } from '@/components/common/ErrorText';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GradientCard } from '@/components/common/GradientCard';
import { Button } from '@/components/ui/button';

interface PostImageDisplayProps {
  imageSrc?: string;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  alt?: string;
  height?: string; // Custom height class like 'h-96', 'h-[600px]', etc.
}

export function PostImageDisplay({
  imageSrc,
  isLoading,
  error,
  onRetry,
  alt = 'Generated post',
  height = 'h-[600px]', // Default to 600px height for 1024px images
}: PostImageDisplayProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const hasImageError = Boolean(imageSrc && failedSrc === imageSrc);

  const renderContent = () => {
    if (error) {
      return <ErrorText message="Failed to generate image" onRetry={onRetry} />;
    }

    if (isLoading) {
      return <LoadingSpinner size="md" message="Generating your post..." />;
    }

    if (hasImageError) {
      return (
        <ErrorText
          message="Failed to load generated image"
          onRetry={() => {
            setFailedSrc(null);
            onRetry();
          }}
        />
      );
    }

    if (imageSrc) {
      return (
        <Button
          type="button"
          variant="ghost"
          className="relative h-full w-full cursor-zoom-in rounded-none p-0 hover:bg-transparent focus-visible:ring-0"
          onClick={() => {
            setIsViewerOpen(true);
          }}
          aria-label="Open image viewer"
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover"
            priority
            onError={() => {
              setFailedSrc(imageSrc ?? null);
            }}
          />
          <div className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            <Expand className="h-3.5 w-3.5" />
            Zoom
          </div>
        </Button>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-gray-500">No image data received</p>
      </div>
    );
  };

  return (
    <>
      <GradientCard variant="highlighted">
        <div
          className={`relative w-full ${height} bg-gray-100 rounded-lg overflow-hidden`}
        >
          {renderContent()}
        </div>
      </GradientCard>

      {isViewerOpen && imageSrc && (
        <Lightbox
          open={isViewerOpen}
          close={() => {
            setIsViewerOpen(false);
          }}
          slides={[{ src: imageSrc }]}
          plugins={[Zoom]}
          controller={{ closeOnBackdropClick: true }}
          zoom={{
            maxZoomPixelRatio: 4,
            scrollToZoom: true,
          }}
          carousel={{
            finite: true,
          }}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
        />
      )}
    </>
  );
}
