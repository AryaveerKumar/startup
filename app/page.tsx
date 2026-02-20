import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section">
          <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight">Turn Your Idea Into a Structured Startup Execution Plan.</h1>
            <p className="mt-5 max-w-3xl text-slate-600">
              Stress-test your startup idea, identify structural risks, and receive a 30-day execution blueprint — before you invest time or money.
            </p>
            <div className="mt-7 flex gap-3">
              <Link href="/signup" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">Start Your Analysis</Link>
              <Link href="/dashboard/new" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">See How It Works</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
