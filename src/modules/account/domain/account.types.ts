export type UserProfile = {
  firstName: string;
  lastName: string;
  phone?: string;
  documentId?: string;
};

export type UserAddress = {
  id: string;
  label?: string;
  recipient?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
};

export type UserAddressInput = Omit<UserAddress, 'id'>;
