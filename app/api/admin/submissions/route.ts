import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await prisma.submission.findMany({ include: { user: true, score: true } });
  return NextResponse.json({ submissions });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const submissionId = String(form.get("submissionId") || "");
  const status = String(form.get("status") || "UNDER_REVIEW") as any;
  const expertNotes = String(form.get("expertNotes") || "");
  const reportPdfUrl = String(form.get("reportPdfUrl") || "");

  await prisma.submission.update({ where: { id: submissionId }, data: { status } });
  await prisma.score.updateMany({ where: { submissionId }, data: { expertNotes, reportPdfUrl } });

  return NextResponse.redirect(new URL("/admin", req.url));
}
