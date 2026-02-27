export interface Address {
  _id?: string;
  label: string;
  fullName: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}
