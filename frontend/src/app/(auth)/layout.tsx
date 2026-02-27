import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="py-6 px-4 sm:px-8">
        <Link href="/" className="font-serif text-2xl text-charcoal hover:text-sand transition-colors">
          Modest Muse Style
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-charcoal-muted">
        © {new Date().getFullYear()} Modest Muse Style. All rights reserved.
      </footer>
    </div>
  );
}
