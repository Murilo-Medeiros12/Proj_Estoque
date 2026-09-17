import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const funcionarios = await prisma.funcionario.findMany({
    include: { empresa: true, cargo: true },
    orderBy: { nome: 'asc' },
  });
  return NextResponse.json(funcionarios);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    codigo,
    nome,
    cpf,
    empresaId,
    cargoId,
    salarioBase,
    dependentes,
    dataAdmissao,
  } = body;

  if (!codigo || !nome || !cpf || !empresaId || !cargoId || salarioBase == null || !dataAdmissao) {
    return NextResponse.json(
      { error: 'codigo, nome, cpf, empresaId, cargoId, salarioBase e dataAdmissao são obrigatórios' },
      { status: 400 }
    );
  }

  const funcionario = await prisma.funcionario.create({
    data: {
      codigo: codigo.toUpperCase(),
      nome,
      cpf,
      empresaId,
      cargoId,
      salarioBase: Number(salarioBase),
      dependentes: Number(dependentes ?? 0),
      dataAdmissao: new Date(dataAdmissao),
    },
    include: { empresa: true, cargo: true },
  });

  return NextResponse.json(funcionario, { status: 201 });
}