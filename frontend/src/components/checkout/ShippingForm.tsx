'use client';

import { useForm } from 'react-hook-form';

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingFormProps {
  onComplete: (data: ShippingFormData) => void;
  defaultEmail?: string;
}

export default function ShippingForm({ onComplete, defaultEmail }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    defaultValues: { email: defaultEmail || '', country: 'US' },
  });

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-5">
      <h2 className="font-serif text-2xl text-charcoal">Shipping Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name *</label>
          <input {...register('fullName', { required: 'Required' })} className="input-field" placeholder="Amira Hassan" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Email *</label>
          <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className="input-field" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
        <input {...register('phone')} type="tel" className="input-field" placeholder="+1 (555) 000-0000" />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Street Address *</label>
        <input {...register('street', { required: 'Required' })} className="input-field" placeholder="123 Elm Street, Apt 4" />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">City *</label>
          <input {...register('city', { required: 'Required' })} className="input-field" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">State / Province</label>
          <input {...register('state')} className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Postal Code *</label>
          <input {...register('postalCode', { required: 'Required' })} className="input-field" />
          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
          <input {...register('country')} className="input-field" />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-4 text-base mt-4">
        Continue to Payment
      </button>
    </form>
  );
}
