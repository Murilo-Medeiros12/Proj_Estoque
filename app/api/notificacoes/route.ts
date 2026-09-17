import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/notificacoes?destino=ALUNO&alunoId=xxx  ou  ?destino=PROFESSOR
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destino = searchParams.get('destino');
  const alunoId = searchParams.get('alunoId');

  const where: any = {};
  if (destino) where.destino = destino;
  if (alunoId) where.alunoId = alunoId;

  const notificacoes = await prisma.notificacao.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json(notificacoes);
}