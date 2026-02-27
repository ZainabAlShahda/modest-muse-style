'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/account');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
        <input
          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
          type="email"
          className="input-field"
          placeholder="your@email.com"
          autoComplete="email"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm font-medium text-charcoal">Password</label>
          <button type="button" className="text-xs text-sand hover:underline">Forgot password?</button>
        </div>
        <div className="relative">
          <input
            {...register('password', { required: 'Password is required' })}
            type={showPassword ? 'text' : 'password'}
            className="input-field pr-10"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal transition-colors">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-charcoal-muted">
        Don't have an account?{' '}
        <Link href="/register" className="text-sand font-medium hover:underline">Create one</Link>
      </p>
    </form>
  );
}
