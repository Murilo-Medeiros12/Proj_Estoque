import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/eventos-folha -> lista todos os eventos (INSS, IRRF, Vale Transporte, etc.)
export async function GET() {
  const eventos = await prisma.eventoFolha.findMany({
    orderBy: { codigo: 'asc' },
  });
  return NextResponse.json(eventos);
}