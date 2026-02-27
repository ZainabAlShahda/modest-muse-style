'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/api';
import Breadcrumb from '@/components/layout/Breadcrumb';

interface ProfileForm {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileForm>({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await axiosInstance.put('/users/profile', { name: data.name });
      await refreshUser?.();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="container-wide py-12 max-w-2xl">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Profile' }]} />
      <h1 className="mt-6 font-serif text-3xl text-charcoal">Profile Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 card p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
          <input {...register('name')} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
          <input {...register('email')} type="email" className="input-field" disabled />
          <p className="mt-1 text-xs text-charcoal-muted">Email cannot be changed.</p>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
