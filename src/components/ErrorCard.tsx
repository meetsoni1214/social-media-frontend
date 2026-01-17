import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  error?: Error | null;
}

export function ErrorCard({
  title = 'Something went wrong',
  message,
  actionLabel = 'Go Back',
  onAction,
  error,
}: ErrorCardProps) {
  const displayMessage =
    message || error?.message || 'An unexpected error occurred';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <GradientCard className="max-w-md w-full">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-6">{displayMessage}</p>
          {onAction && (
            <GradientButton onClick={onAction}>{actionLabel}</GradientButton>
          )}
        </div>
      </GradientCard>
    </div>
  );
}
