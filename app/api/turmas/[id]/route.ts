import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.turma.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao apagar turma.' }, { status: 500 });
  }
}