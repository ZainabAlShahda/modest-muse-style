import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Shipping
export const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

// Product (admin)
const variantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1, 'Color is required'),
  colorHex: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sku: z.string().min(1, 'SKU is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(120),
  description: z.string().min(10, 'Description too short'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  compareAtPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Category is required'),
  fabric: z.string().optional(),
  careInstructions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
});

// Contact form
export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ShippingInput = z.infer<typeof shippingSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
