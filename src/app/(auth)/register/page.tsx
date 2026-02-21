'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { GradientButton } from '@/components/common/GradientButton';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { signupSchema, type SignupFormData } from '@/lib/utils/validation';

const ROLE_OPTIONS = [
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'digital-marketer', label: 'Digital Marketer' },
  { value: 'graphic-designer', label: 'Graphic Designer' },
  { value: 'content-creator', label: 'Content Creator' },
  { value: 'other', label: 'Other' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [phoneNumber] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return sessionStorage.getItem('verifiedPhone') ?? '';
  });
  const [error, setError] = useState('');

  const { mutate: register, isPending } = useRegister();

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: phoneNumber,
      role: '',
    },
  });

  useEffect(() => {
    if (!phoneNumber) {
      router.push('/login');
    }
  }, [phoneNumber, router]);

  const handleSignupSubmit = async (data: SignupFormData) => {
    setError('');

    register(data, {
      onSuccess: response => {
        if (response.user) {
          sessionStorage.removeItem('verifiedPhone');
          router.push('/business-profile');
        } else {
          setError('Registration failed. Please try again.');
        }
      },
      onError: (err: Error) => {
        setError(err.message || 'Registration failed. Please try again.');
      },
    });
  };

  if (!phoneNumber) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              {...signupForm.register('firstName')}
              className="mt-1"
            />
            {signupForm.formState.errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {signupForm.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...signupForm.register('lastName')}
              className="mt-1"
            />
            {signupForm.formState.errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {signupForm.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...signupForm.register('email')}
              className="mt-1"
            />
            {signupForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {signupForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone-display">Phone Number</Label>
            <Input
              id="phone-display"
              type="tel"
              value={phoneNumber}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="role">Role (Optional)</Label>
            <Select id="role" className="mt-1" {...signupForm.register('role')}>
              <option value="">Select your role</option>
              {ROLE_OPTIONS.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </Select>
            {signupForm.formState.errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {signupForm.formState.errors.role.message}
              </p>
            )}
          </div>

          <GradientButton type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating Account...' : 'Create Account'}
          </GradientButton>
        </form>
      </Card>
    </div>
  );
}
