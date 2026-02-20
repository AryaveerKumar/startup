import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { submissions: { orderBy: { createdAt: "desc" }, include: { score: true } } }
  });

  if (!user) redirect("/login");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(1120px,calc(100%-2rem))] py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-slate-600">Credits remaining: <span className="font-semibold">{user.credits}</span></p>
          </div>
          <Link href="/dashboard/new" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">Submit New Idea</Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Idea</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {user.submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-slate-200">
                  <td className="px-4 py-3"><Link className="underline" href={`/dashboard/submissions/${submission.id}`}>{submission.ideaTitle}</Link></td>
                  <td className="px-4 py-3">{submission.status}</td>
                  <td className="px-4 py-3">{submission.score?.total ?? "-"}</td>
                  <td className="px-4 py-3">{submission.updatedAt.toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
