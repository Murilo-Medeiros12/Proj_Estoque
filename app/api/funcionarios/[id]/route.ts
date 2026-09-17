import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.funcionario.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao apagar funcionário.' }, { status: 500 });
  }
}