import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const alunos = await prisma.aluno.findMany({
    include: { turma: true },
    orderBy: { nome: 'asc' },
  });
  return NextResponse.json(alunos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, matricula, turmaId } = body;

  if (!nome || !matricula || !turmaId) {
    return NextResponse.json(
      { error: 'nome, matricula e turmaId são obrigatórios' },
      { status: 400 }
    );
  }

  try {
    const aluno = await prisma.aluno.create({
      data: { nome, matricula: matricula.trim(), turmaId },
      include: { turma: true },
    });
    return NextResponse.json(aluno, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um aluno com essa matrícula.' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Erro ao cadastrar aluno.' }, { status: 500 });
  }
}