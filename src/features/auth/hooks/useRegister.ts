import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api';
import type { SignupFormData } from '@/lib/utils/validation';
import type { RegisterResponse } from '@/features/auth/types/auth';

export function useRegister() {
  return useMutation<RegisterResponse, Error, SignupFormData>({
    mutationFn: (signupData: SignupFormData) =>
      authService.register(signupData),
  });
}
