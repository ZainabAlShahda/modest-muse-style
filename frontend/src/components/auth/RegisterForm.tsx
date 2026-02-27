'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/api';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axiosInstance.post('/auth/register', { name: data.name, email: data.email, password: data.password });
      await login(data.email, data.password);
      toast.success('Account created! Welcome to Modest Muse Style.');
      router.push('/account');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
        <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })} className="input-field" placeholder="Amira Hassan" autoComplete="name" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
        <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className="input-field" placeholder="your@email.com" autoComplete="email" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
        <input {...register('password', { required: 'Required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} type="password" className="input-field" placeholder="Min. 8 characters" autoComplete="new-password" />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm Password</label>
        <input {...register('confirmPassword', { validate: (v) => v === password || 'Passwords do not match' })} type="password" className="input-field" placeholder="Repeat password" autoComplete="new-password" />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
        {isSubmitting ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-charcoal-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-sand font-medium hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
