import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Modest Muse Style account.',
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Join Modest Muse</h1>
        <p className="mt-2 text-charcoal-muted">Create an account to start shopping.</p>
      </div>
      <div className="card p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
