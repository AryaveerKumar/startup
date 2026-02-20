import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") redirect("/dashboard");

  const submissions = await prisma.submission.findMany({ include: { user: true, score: true }, orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto w-[min(1200px,calc(100%-2rem))] py-10">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p className="mt-2 text-sm text-slate-600">Review submissions, adjust pillar scores, add notes, and mark completion.</p>
      <div className="mt-6 space-y-4">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold">{s.ideaTitle} <span className="text-sm text-slate-500">({s.user.email})</span></p>
            <p className="text-sm text-slate-600">Status: {s.status} | Score: {s.score?.total ?? "-"}</p>
            <form action="/api/admin/submissions" method="post" className="mt-3 grid grid-cols-5 gap-2 text-sm">
              <input type="hidden" name="submissionId" value={s.id} />
              <input name="marketDemand" className="rounded border p-1" placeholder="Market" />
              <input name="competition" className="rounded border p-1" placeholder="Competition" />
              <input name="founderFit" className="rounded border p-1" placeholder="Founder fit" />
              <input name="expertNotes" className="rounded border p-1" placeholder="Expert notes" />
              <select name="status" className="rounded border p-1">
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <input name="reportPdfUrl" className="col-span-4 rounded border p-1" placeholder="PDF report URL placeholder" />
              <button className="rounded bg-accent px-2 py-1 text-white">Save</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
