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
  dni?: string;
};

type AddressApiDto = {
  id?: string | number;
  label?: string;
  recipient?: string;
  receiverName?: string;
  receiver_name?: string;
  receiverPhone?: string;
  receiver_phone?: string;
  line1?: string;
  line_1?: string;
  street?: string;
  streetNumber?: string;
  street_number?: string;
  line2?: string;
  line_2?: string;
  floor?: string;
  apartment?: string;
  city?: string;
  state?: string;
  stateName?: string;
  state_name?: string;
  postalCode?: string;
  postal_code?: string;
  country?: string;
  countryCode?: string;
  country_code?: string;
  isDefaultShipping?: boolean;
  is_default_shipping?: boolean;
  isDefaultBilling?: boolean;
  is_default_billing?: boolean;
};

const toProfile = (dto: ProfileApiDto): UserProfile => ({
  firstName: dto.firstName ?? dto.first_name ?? '',
  lastName: dto.lastName ?? dto.last_name ?? '',
  phone: dto.phone,
  documentId: dto.documentId ?? dto.document_id ?? dto.dni
});

const toAddress = (dto: AddressApiDto, index: number): UserAddress => {
  const line1 = [dto.street ?? dto.line1 ?? dto.line_1 ?? '', dto.streetNumber ?? dto.street_number ?? '']
    .join(' ')
    .trim();
  const line2 = [dto.floor ?? '', dto.apartment ?? '', dto.line2 ?? dto.line_2 ?? ''].join(' ').trim();

  return {
    id: String(dto.id ?? `address-${index + 1}`),
    label: dto.label,
    recipient: dto.recipient ?? dto.receiverName ?? dto.receiver_name,
    line1,
    line2: line2 || undefined,
    city: dto.city ?? '',
    state: dto.state ?? dto.stateName ?? dto.state_name,
    postalCode: dto.postalCode ?? dto.postal_code,
    country: dto.country ?? dto.countryCode ?? dto.country_code,
    isDefaultShipping: dto.isDefaultShipping ?? dto.is_default_shipping,
    isDefaultBilling: dto.isDefaultBilling ?? dto.is_default_billing
  };
};

const normalizeList = (data: AddressApiDto[] | { items?: AddressApiDto[]; data?: AddressApiDto[] }): AddressApiDto[] =>
  Array.isArray(data) ? data : data.items ?? data.data ?? [];

const toProfilePayload = (payload: UserProfile) => ({
  firstName: payload.firstName,
  lastName: payload.lastName,
  phone: payload.phone,
  documentId: payload.documentId,
  dni: payload.documentId
});

const toAddressPayload = (payload: UserAddressInput) => {
  const [street = '', ...streetNumberTokens] = payload.line1.trim().split(/\s+/);
  const streetNumber = streetNumberTokens.join(' ').trim();

  return {
    label: payload.label,
    recipient: payload.recipient,
    receiverName: payload.recipient,
    street: street || payload.line1,
    streetNumber: streetNumber || undefined,
    line1: payload.line1,
    line2: payload.line2,
    city: payload.city,
    state: payload.state,
    stateName: payload.state,
    postalCode: payload.postalCode,
    countryCode: payload.country,
    country: payload.country,
    isDefaultShipping: payload.isDefaultShipping,
    isDefaultBilling: payload.isDefaultBilling
  };
};

export const accountApiRepository = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await httpClient.get<ProfileApiDto>(API_ENDPOINTS.me.profile);
    return toProfile(data);
  },
  async updateProfile(payload: UserProfile): Promise<UserProfile> {
    const { data } = await httpClient.put<ProfileApiDto>(API_ENDPOINTS.me.profile, toProfilePayload(payload));
    return toProfile(data);
  },
  async listAddresses(): Promise<UserAddress[]> {
    const { data } = await httpClient.get<AddressApiDto[] | { items?: AddressApiDto[]; data?: AddressApiDto[] }>(API_ENDPOINTS.me.addresses);
    return normalizeList(data).map(toAddress);
  },
  async createAddress(payload: UserAddressInput): Promise<UserAddress> {
    const { data } = await httpClient.post<AddressApiDto>(API_ENDPOINTS.me.addresses, toAddressPayload(payload));
    return toAddress(data, 0);
  },
  async updateAddress(id: string, payload: UserAddressInput): Promise<UserAddress> {
    const { data } = await httpClient.put<AddressApiDto>(API_ENDPOINTS.me.addressById(id), toAddressPayload(payload));
    return toAddress(data, 0);
  },
  async deleteAddress(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.me.addressById(id));
  }
};
