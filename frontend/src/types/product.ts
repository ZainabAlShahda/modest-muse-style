export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  sku: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  fabric?: string;
  careInstructions?: string[];
  tags?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  ratingsAverage: number;
  ratingsCount: number;
  totalStock: number;
  createdAt: string;
}
