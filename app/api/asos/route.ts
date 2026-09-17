import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const asos = await prisma.registroASO.findMany({
    include: { funcionario: true },
    orderBy: { data: 'desc' },
  });
  return NextResponse.json(asos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { funcionarioId, tipo, medico, data, resultado } = body;

  if (!funcionarioId || !tipo || !medico || !data) {
    return NextResponse.json(
      { error: 'funcionarioId, tipo, medico e data são obrigatórios' },
      { status: 400 }
    );
  }

  const registro = await prisma.registroASO.create({
    data: {
      funcionarioId,
      tipo,
      medico,
      data: new Date(data),
      resultado: resultado || 'APTO',
    },
    include: { funcionario: true },
  });

  return NextResponse.json(registro, { status: 201 });
}