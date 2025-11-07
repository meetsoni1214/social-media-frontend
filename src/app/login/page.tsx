'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientButton } from '@/components/GradientButton';
import { apiClient } from '@/lib/api';
import {
  phoneSchema,
  otpSchema,
  type PhoneFormData,
  OTPFormData,
} from '@/lib/validations';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [flowState, setFlowState] = useState<
    'phone-entry' | 'otp-verification'
  >('phone-entry');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.requestOtp(data.phone);

      if (response.message) {
        setPhoneNumber(data.phone);
        setFlowState('otp-verification');
      } else {
        setError('OTP Verification Failed!');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.verifyOtp(phoneNumber, data.otp);

      if (response.message) {
        sessionStorage.setItem('verifiedPhone', phoneNumber);
        router.push('/register');
      } else {
        console.warn('Unexpected response structure:', response);
        setError('Invalid OTP. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Error during OTP verification:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.requestOtp(phoneNumber);

      if (response.message) {
        setError('OTP resent successfully!');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-gray-600 mt-2">
            {flowState === 'phone-entry' &&
              'Enter your phone number to continue'}
            {flowState === 'otp-verification' && 'Verify your OTP'}
          </p>
        </div>

        {error && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              error.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {error}
          </div>
        )}

        {/* Phone Entry State */}
        {flowState === 'phone-entry' && (
          <form
            onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+919876543210"
                {...phoneForm.register('phone')}
                className="mt-1"
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {phoneForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <GradientButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </GradientButton>
          </form>
        )}

        {flowState === 'otp-verification' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              OTP sent to {phoneNumber}
            </div>

            <form
              onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  {...otpForm.register('otp')}
                  className="mt-1 text-center text-2xl tracking-widest"
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <GradientButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </GradientButton>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="w-full text-sm text-purple-600 hover:text-purple-700 underline"
              >
                Resend OTP
              </button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
