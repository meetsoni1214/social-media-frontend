import { useState, useCallback } from 'react';

interface UseImageDownloadOptions {
  filename?: string;
  successDuration?: number;
}

interface UseImageDownloadReturn {
  isDownloading: boolean;
  downloadSuccess: boolean;
  error: string | null;
  downloadImage: (base64Data: string, customFilename?: string) => Promise<void>;
  resetStates: () => void;
}

export function useImageDownload(
  options: UseImageDownloadOptions = {}
): UseImageDownloadReturn {
  const { successDuration = 3000 } = options;

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetStates = useCallback(() => {
    setDownloadSuccess(false);
    setError(null);
  }, []);

  const downloadImage = useCallback(
    async (base64Data: string, customFilename?: string) => {
      if (!base64Data) {
        setError('No image data available');
        return;
      }

      setIsDownloading(true);
      setError(null);
      setDownloadSuccess(false);

      try {
        const response = await fetch(`data:image/png;base64,${base64Data}`);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = customFilename || options.filename || 'post.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), successDuration);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Download failed';
        setError(errorMessage);
        console.error('Download failed:', err);
      } finally {
        setIsDownloading(false);
      }
    },
    [options.filename, successDuration]
  );

  return {
    isDownloading,
    downloadSuccess,
    error,
    downloadImage,
    resetStates,
  };
}
