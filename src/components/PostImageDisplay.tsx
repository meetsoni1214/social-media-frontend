import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { GradientButton } from '@/components/GradientButton';
import { GradientCard } from '@/components/GradientCard';

interface PostImageDisplayProps {
  imageData?: string;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  alt?: string;
}

export function PostImageDisplay({
  imageData,
  isLoading,
  error,
  onRetry,
  alt = 'Generated post',
}: PostImageDisplayProps) {
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-red-500 mb-2">Failed to generate image</p>
          <GradientButton onClick={onRetry} className="text-xs">
            Retry
          </GradientButton>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--gradient-pink)]" />
          <p className="text-sm text-gray-500 mt-2">Generating your post...</p>
        </div>
      );
    }

    if (imageData) {
      return (
        <Image
          src={`data:image/png;base64,${imageData}`}
          alt={alt}
          fill
          className="object-cover"
          priority
          onError={e => console.error('Image failed to load:', e)}
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
      <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden">
        {renderContent()}
      </div>
    </GradientCard>
  );
}
