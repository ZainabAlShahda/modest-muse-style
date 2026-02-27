import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Modest Muse Style account.',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Welcome Back</h1>
        <p className="mt-2 text-charcoal-muted">Sign in to your account to continue.</p>
      </div>
      <div className="card p-8">
        <LoginForm />
      </div>
    </div>
  );
}
