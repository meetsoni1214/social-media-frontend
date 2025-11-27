import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { SignupFormData } from '@/lib/validations';
import type { RegisterResponse } from '@/types/auth';

export function useRegister() {
  return useMutation<RegisterResponse, Error, SignupFormData>({
    mutationFn: (signupData: SignupFormData) => apiClient.register(signupData),
  });
}
