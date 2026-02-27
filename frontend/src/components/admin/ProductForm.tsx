'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Loader2 } from 'lucide-react';
import { axiosInstance } from '@/lib/api';
import { SIZES } from '@/lib/constants';
import ImageUploader from './ImageUploader';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { apiClient } from '@/lib/api';

interface Variant {
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | '';
  category: string;
  fabric: string;
  careInstructions: string;
  tags: string;
  isFeatured: boolean;
  isPublished: boolean;
  variants: Variant[];
}

interface ProductFormProps {
  product?: any; // existing product for edit mode
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEdit = Boolean(product);
  const [images, setImages] = useState<any[]>(product?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoriesData } = useSWR('/categories', apiClient);
  const categories = categoriesData?.data || [];

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      compareAtPrice: product?.compareAtPrice || '',
      category: product?.category?._id || '',
      fabric: product?.fabric || '',
      careInstructions: product?.careInstructions?.join('\n') || '',
      tags: product?.tags?.join(', ') || '',
      isFeatured: product?.isFeatured || false,
      isPublished: product?.isPublished || false,
      variants: product?.variants || [{ size: 'M', color: '', colorHex: '', stock: 0, sku: '' }],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) { toast.error('Please upload at least one product image'); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
        images,
        careInstructions: data.careInstructions ? data.careInstructions.split('\n').filter(Boolean) : [],
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        variants: data.variants.map((v) => ({ ...v, stock: Number(v.stock) })),
      };

      if (isEdit) {
        await axiosInstance.put(`/products/${product.slug}`, payload);
        toast.success('Product updated');
      } else {
        await axiosInstance.post('/products', payload);
        toast.success('Product created');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-h-[80vh] overflow-y-auto pr-2">

      {/* Basic info */}
      <section className="space-y-4">
        <h3 className="font-serif text-lg text-charcoal border-b border-sand-100 pb-2">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Product Name *</label>
          <input {...register('name', { required: 'Required' })} className="input-field" placeholder="e.g. Amal Maxi Dress" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Description *</label>
          <textarea {...register('description', { required: 'Required' })} rows={4} className="input-field resize-none" placeholder="Describe the product..." />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Price (USD) *</label>
            <input {...register('price', { required: 'Required', min: { value: 0, message: 'Must be positive' } })} type="number" step="0.01" className="input-field" placeholder="79.99" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Compare At Price</label>
            <input {...register('compareAtPrice')} type="number" step="0.01" className="input-field" placeholder="99.99 (optional)" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Category *</label>
          <select {...register('category', { required: 'Required' })} className="input-field">
            <option value="">Select category…</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </section>

      {/* Images */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg text-charcoal border-b border-sand-100 pb-2">Product Images</h3>
        <ImageUploader images={images} onChange={setImages} maxImages={6} />
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 pb-2">
          <h3 className="font-serif text-lg text-charcoal">Variants</h3>
          <button
            type="button"
            onClick={() => appendVariant({ size: 'M', color: '', colorHex: '', stock: 0, sku: '' })}
            className="btn-ghost text-xs flex items-center gap-1 py-1.5"
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variantFields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-5 gap-2 items-start p-3 bg-sand-50 rounded-xl">
              <div>
                <label className="text-xs text-charcoal-muted mb-1 block">Size</label>
                <select {...register(`variants.${idx}.size`)} className="input-field text-xs py-1.5">
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-charcoal-muted mb-1 block">Color</label>
                <input {...register(`variants.${idx}.color`)} placeholder="Ivory" className="input-field text-xs py-1.5" />
              </div>
              <div>
                <label className="text-xs text-charcoal-muted mb-1 block">Hex</label>
                <input {...register(`variants.${idx}.colorHex`)} type="color" className="input-field text-xs py-1 px-2 cursor-pointer" />
              </div>
              <div>
                <label className="text-xs text-charcoal-muted mb-1 block">Stock</label>
                <input {...register(`variants.${idx}.stock`, { min: 0 })} type="number" min="0" className="input-field text-xs py-1.5" placeholder="0" />
              </div>
              <div className="relative">
                <label className="text-xs text-charcoal-muted mb-1 block">SKU</label>
                <div className="flex gap-1">
                  <input {...register(`variants.${idx}.sku`, { required: 'Required' })} placeholder="MMS-001-M-IVY" className="input-field text-xs py-1.5 flex-1 min-w-0" />
                  {variantFields.length > 1 && (
                    <button type="button" onClick={() => removeVariant(idx)} className="shrink-0 text-red-400 hover:text-red-600 transition-colors pt-1">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="space-y-4">
        <h3 className="font-serif text-lg text-charcoal border-b border-sand-100 pb-2">Product Details</h3>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Fabric</label>
          <input {...register('fabric')} className="input-field" placeholder="e.g. 100% Premium Viscose" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Care Instructions</label>
          <textarea {...register('careInstructions')} rows={3} className="input-field resize-none" placeholder="One instruction per line&#10;Hand wash cold&#10;Do not tumble dry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Tags</label>
          <input {...register('tags')} className="input-field" placeholder="maxi, summer, abaya (comma separated)" />
        </div>
      </section>

      {/* Publish settings */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg text-charcoal border-b border-sand-100 pb-2">Visibility</h3>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input {...register('isPublished')} type="checkbox" className="w-4 h-4 rounded accent-sand" />
          <div>
            <p className="text-sm font-medium text-charcoal">Published</p>
            <p className="text-xs text-charcoal-muted">Visible in the shop</p>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded accent-sand" />
          <div>
            <p className="text-sm font-medium text-charcoal">Featured</p>
            <p className="text-xs text-charcoal-muted">Shown on the homepage</p>
          </div>
        </label>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-sand-100 sticky bottom-0 bg-white py-4 -mx-2 px-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
