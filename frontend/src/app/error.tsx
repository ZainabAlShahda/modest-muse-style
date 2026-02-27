'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center mb-6">
        <span className="text-blush text-2xl">!</span>
      </div>
      <h1 className="font-serif text-3xl text-charcoal">Something Went Wrong</h1>
      <p className="mt-3 text-charcoal-muted max-w-md leading-relaxed">
        An unexpected error occurred. Please try again, or contact support if the problem persists.
      </p>
      <div className="mt-8 flex gap-4">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <a href="/" className="btn-secondary">Go Home</a>
      </div>
    </div>
  );
}
