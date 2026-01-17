import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  retryLabel = 'Try Again',
}: ErrorMessageProps) {
  const displayMessage =
    message ||
    (error instanceof Error ? error.message : null) ||
    'An unexpected error occurred. Please try again.';

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <GradientCard variant="highlighted">
        <div className="flex flex-col items-center text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{displayMessage}</p>
          {onRetry && (
            <GradientButton onClick={onRetry}>
              <RefreshCw className="w-4 h-4" />
              {retryLabel}
            </GradientButton>
          )}
        </div>
      </GradientCard>
    </div>
  );
}
