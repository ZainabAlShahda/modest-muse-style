export interface OrderItem {
  product: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  sku?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}
