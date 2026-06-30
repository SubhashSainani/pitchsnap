import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Page not found
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/generate"
          className="bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
        >
          Back to Generate
        </Link>
      </div>
    </main>
  );
}
