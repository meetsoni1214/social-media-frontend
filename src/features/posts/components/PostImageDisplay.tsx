import Image from 'next/image';
import { useState } from 'react';
import { ErrorText } from '@/components/common/ErrorText';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GradientCard } from '@/components/common/GradientCard';

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
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-gray-500">No image data received</p>
      </div>
    );
  };

  return (
    <GradientCard variant="highlighted">
      <div
        className={`relative w-full ${height} bg-gray-100 rounded-lg overflow-hidden`}
      >
        {renderContent()}
      </div>
    </GradientCard>
  );
}
