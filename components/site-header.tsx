import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 w-[min(1120px,calc(100%-2rem))] items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Execution Blueprint</p>
          <p className="text-xs text-slate-500">The startup for startups.</p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/upgrade" className="rounded-md bg-accent px-3 py-2 font-medium text-white">Upgrade</Link>
        </nav>
      </div>
    </header>
  );
}
