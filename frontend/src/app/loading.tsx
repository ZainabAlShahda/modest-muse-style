export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-sand border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-lg text-charcoal-muted">Loading…</p>
      </div>
    </div>
  );
}
