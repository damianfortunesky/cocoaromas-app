import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { UserAddress, UserAddressInput, UserProfile } from '@/modules/account/domain/account.types';

type ProfileApiDto = {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  phone?: string;
  documentId?: string;
  document_id?: string;
};

type AddressApiDto = {
  id?: string | number;
  label?: string;
  recipient?: string;
  line1?: string;
  line_1?: string;
  line2?: string;
  line_2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  postal_code?: string;
  country?: string;
  isDefaultShipping?: boolean;
  is_default_shipping?: boolean;
  isDefaultBilling?: boolean;
  is_default_billing?: boolean;
};

const toProfile = (dto: ProfileApiDto): UserProfile => ({
  firstName: dto.firstName ?? dto.first_name ?? '',
  lastName: dto.lastName ?? dto.last_name ?? '',
  phone: dto.phone,
  documentId: dto.documentId ?? dto.document_id
});

const toAddress = (dto: AddressApiDto, index: number): UserAddress => ({
  id: String(dto.id ?? `address-${index + 1}`),
  label: dto.label,
  recipient: dto.recipient,
  line1: dto.line1 ?? dto.line_1 ?? '',
  line2: dto.line2 ?? dto.line_2,
  city: dto.city ?? '',
  state: dto.state,
  postalCode: dto.postalCode ?? dto.postal_code,
  country: dto.country,
  isDefaultShipping: dto.isDefaultShipping ?? dto.is_default_shipping,
  isDefaultBilling: dto.isDefaultBilling ?? dto.is_default_billing
});

const normalizeList = (data: AddressApiDto[] | { items?: AddressApiDto[]; data?: AddressApiDto[] }): AddressApiDto[] =>
  Array.isArray(data) ? data : data.items ?? data.data ?? [];

export const accountApiRepository = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await httpClient.get<ProfileApiDto>(API_ENDPOINTS.me.profile);
    return toProfile(data);
  },
  async updateProfile(payload: UserProfile): Promise<UserProfile> {
    const { data } = await httpClient.put<ProfileApiDto>(API_ENDPOINTS.me.profile, payload);
    return toProfile(data);
  },
  async listAddresses(): Promise<UserAddress[]> {
    const { data } = await httpClient.get<AddressApiDto[] | { items?: AddressApiDto[]; data?: AddressApiDto[] }>(API_ENDPOINTS.me.addresses);
    return normalizeList(data).map(toAddress);
  },
  async createAddress(payload: UserAddressInput): Promise<UserAddress> {
    const { data } = await httpClient.post<AddressApiDto>(API_ENDPOINTS.me.addresses, payload);
    return toAddress(data, 0);
  },
  async updateAddress(id: string, payload: UserAddressInput): Promise<UserAddress> {
    const { data } = await httpClient.put<AddressApiDto>(API_ENDPOINTS.me.addressById(id), payload);
    return toAddress(data, 0);
  },
  async deleteAddress(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.me.addressById(id));
  }
};
