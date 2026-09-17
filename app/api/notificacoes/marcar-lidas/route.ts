import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ ok: true });
  }

  await prisma.notificacao.updateMany({
    where: { id: { in: ids } },
    data: { lida: true },
  });

  return NextResponse.json({ ok: true });
}