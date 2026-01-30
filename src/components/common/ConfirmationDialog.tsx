import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'warning' | 'danger';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'warning',
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="animate-slide-up">
        <GradientCard className="max-w-md w-full mx-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  variant === 'danger'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-orange-100 text-orange-600'
                )}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">{message}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <GradientButton
                variant="secondary"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </GradientButton>
              <GradientButton
                variant="primary"
                className="flex-1"
                onClick={onConfirm}
                isLoading={isLoading}
                loadingText="Processing..."
              >
                {confirmText}
              </GradientButton>
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
