export default function Loading() {
  return (
    <div className="min-h-screen bg-sand">
      {/* Navbar placeholder */}
      <div className="h-16 bg-cream/80 border-b border-forest/10 animate-pulse" />

      {/* Hero placeholder */}
      <div className="min-h-[60vh] bg-gradient-to-br from-forest/10 to-teal/5 animate-pulse" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="h-4 w-32 bg-forest/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-forest/10 rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-forest/8 rounded-full mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl bg-cream border border-forest/10 overflow-hidden animate-pulse">
              <div className="h-52 bg-forest/10" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-forest/10 rounded-full" />
                <div className="h-3 w-1/2 bg-forest/8 rounded-full" />
                <div className="h-2 w-full bg-forest/8 rounded-full mt-4" />
                <div className="h-9 w-24 bg-teal/20 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
