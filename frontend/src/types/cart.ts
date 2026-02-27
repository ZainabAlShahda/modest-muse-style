export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}
