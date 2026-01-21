import { GradientButton } from './GradientButton';

interface ErrorTextProps {
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorText({
  message,
  error,
  onRetry,
  retryLabel = 'Retry',
  className = '',
}: ErrorTextProps) {
  const displayMessage =
    message ||
    (error instanceof Error ? error.message : null) ||
    'An error occurred. Please try again.';

  return (
    <div
      className={`flex flex-col items-center justify-center h-full ${className}`}
    >
      <p className="text-sm text-red-500 mb-2">{displayMessage}</p>
      {onRetry && (
        <GradientButton onClick={onRetry} className="text-xs">
          {retryLabel}
        </GradientButton>
      )}
    </div>
  );
}
