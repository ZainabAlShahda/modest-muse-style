import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-serif text-sand-200 font-bold">404</p>
      <h1 className="mt-4 font-serif text-3xl text-charcoal">Page Not Found</h1>
      <p className="mt-3 text-charcoal-muted max-w-md leading-relaxed">
        We couldn't find the page you were looking for. It may have moved or the link might be incorrect.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/shop" className="btn-secondary">Shop Now</Link>
      </div>
    </div>
  );
}
