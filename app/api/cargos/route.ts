import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cargos = await prisma.cargo.findMany({
    orderBy: { titulo: 'asc' },
  });
  return NextResponse.json(cargos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    codigo,
    titulo,
    salarioBase,
    jornadaMensal,
    adicionalInsalubridade,
    adicionalPericulosidade,
  } = body;

  if (!codigo || !titulo || salarioBase == null || jornadaMensal == null) {
    return NextResponse.json(
      { error: 'codigo, titulo, salarioBase e jornadaMensal são obrigatórios' },
      { status: 400 }
    );
  }

  const cargo = await prisma.cargo.create({
    data: {
      codigo: codigo.toUpperCase(),
      titulo,
      salarioBase: Number(salarioBase),
      jornadaMensal: Number(jornadaMensal),
      adicionalInsalubridade: Boolean(adicionalInsalubridade),
      adicionalPericulosidade: Boolean(adicionalPericulosidade),
    },
  });

  return NextResponse.json(cargo, { status: 201 });
}