import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { matricula } = body;

  if (!matricula) {
    return NextResponse.json({ error: 'Informe a matrícula.' }, { status: 400 });
  }

  const aluno = await prisma.aluno.findUnique({
    where: { matricula: matricula.trim() },
    include: { turma: true },
  });

  if (!aluno) {
    return NextResponse.json({ error: 'Matrícula não encontrada. Confira com o professor.' }, { status: 404 });
  }

  return NextResponse.json(aluno);
}