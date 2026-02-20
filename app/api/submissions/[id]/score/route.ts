import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreSubmission } from "@/lib/scoring";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submission = await prisma.submission.findFirst({ where: { id: params.id, userId: session.user.id }, include: { score: true } });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ status: submission.status, score: submission.score });
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.credits < 1) return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });

  const submission = await prisma.submission.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const scored = scoreSubmission(submission);

  const score = await prisma.score.upsert({
    where: { submissionId: submission.id },
    create: {
      submissionId: submission.id,
      total: scored.total,
      riskTier: scored.riskTier,
      marketDemand: scored.pillars.marketDemand,
      competition: scored.pillars.competition,
      scalability: scored.pillars.scalability,
      founderFit: scored.pillars.founderFit,
      capitalFeasibility: scored.pillars.capitalFeasibility,
      executionMarketing: scored.pillars.executionMarketing,
      pillarSummary: scored.pillarSummary,
      pivotSuggestions: scored.pivotSuggestions
    },
    update: {
      total: scored.total,
      riskTier: scored.riskTier,
      marketDemand: scored.pillars.marketDemand,
      competition: scored.pillars.competition,
      scalability: scored.pillars.scalability,
      founderFit: scored.pillars.founderFit,
      capitalFeasibility: scored.pillars.capitalFeasibility,
      executionMarketing: scored.pillars.executionMarketing,
      pillarSummary: scored.pillarSummary,
      pivotSuggestions: scored.pivotSuggestions
    }
  });

  await prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } });
  await prisma.creditTransaction.create({ data: { userId: user.id, change: -1, reason: `Score generation for ${submission.id}` } });
  await prisma.submission.update({ where: { id: submission.id }, data: { status: "SCORED" } });

  return NextResponse.json({ score });
}
