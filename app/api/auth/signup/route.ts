import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      credits: 1,
      plan: "FREE"
    }
  });

  await prisma.creditTransaction.create({
    data: { userId: user.id, change: 1, reason: "Initial free credits" }
  });

  return NextResponse.json({ ok: true });
}
