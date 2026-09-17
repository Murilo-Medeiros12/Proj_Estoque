import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const pontos = await prisma.registroPonto.findMany({
    include: { funcionario: true },
    orderBy: { data: 'desc' },
  });
  return NextResponse.json(pontos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { funcionarioId, data, entrada, saidaAlmoco, retornoAlmoco, saida, horasExtras, status } = body;

  if (!funcionarioId || !data || !entrada || !saida) {
    return NextResponse.json(
      { error: 'funcionarioId, data, entrada e saida são obrigatórios' },
      { status: 400 }
    );
  }

  const registro = await prisma.registroPonto.create({
    data: {
      funcionarioId,
      data: new Date(data),
      entrada,
      saidaAlmoco: saidaAlmoco || '12:00',
      retornoAlmoco: retornoAlmoco || '13:00',
      saida,
      horasExtras: horasExtras || '0h',
      status: status || 'REGULAR',
    },
    include: { funcionario: true },
  });

  return NextResponse.json(registro, { status: 201 });
}