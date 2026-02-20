import { SiteHeader } from "@/components/site-header";

export default function UpgradePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(960px,calc(100%-2rem))] py-10">
        <h1 className="text-2xl font-semibold">Serious Builder Plan</h1>
        <p className="mt-2 text-slate-600">Detailed execution intelligence with expert refinement.</p>

        <div className="mt-6 rounded-xl border border-slate-200 p-6">
          <ul className="list-disc space-y-2 pl-6 text-slate-600">
            <li>Priority expert review (12–24 hours)</li>
            <li>Detailed execution blueprint</li>
            <li>Structured 30-day roadmap</li>
            <li>One free re-score within 30 days</li>
            <li>5 monthly credits</li>
          </ul>
          <button className="mt-5 rounded-md bg-accent px-4 py-2 text-white">Payment Integration Placeholder</button>
        </div>
      </main>
    </>
  );
}
