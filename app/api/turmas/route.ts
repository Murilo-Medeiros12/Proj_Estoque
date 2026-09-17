import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const turmas = await prisma.turma.findMany({
    orderBy: { nome: 'asc' },
    include: { _count: { select: { alunos: true } } },
  });

  const resposta = turmas.map((t) => ({
    id: t.id,
    nome: t.nome,
    alunosCount: t._count.alunos,
  }));

  return NextResponse.json(resposta);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome } = body;

  if (!nome) {
    return NextResponse.json({ error: 'nome é obrigatório' }, { status: 400 });
  }

  const turma = await prisma.turma.create({ data: { nome } });
  return NextResponse.json({ ...turma, alunosCount: 0 }, { status: 201 });
}