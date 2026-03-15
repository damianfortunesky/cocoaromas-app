import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountApiRepository } from '@/modules/account/infrastructure/accountApiRepository';
import type { UserAddressInput, UserProfile } from '@/modules/account/domain/account.types';

export const useMyProfile = () =>
  useQuery({
    queryKey: ['me-profile'],
    queryFn: () => accountApiRepository.getProfile()
  });

export const useMyAddresses = () =>
  useQuery({
    queryKey: ['me-addresses'],
    queryFn: () => accountApiRepository.listAddresses()
  });

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserProfile) => accountApiRepository.updateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-profile'] });
    }
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserAddressInput) => accountApiRepository.createAddress(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-addresses'] });
    }
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserAddressInput }) => accountApiRepository.updateAddress(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-addresses'] });
    }
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountApiRepository.deleteAddress(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-addresses'] });
    }
  });
};
