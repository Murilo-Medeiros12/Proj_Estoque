import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const empresas = await prisma.empresa.findMany({
    orderBy: { razaoSocial: 'asc' },
    include: {
      _count: {
        select: { setores: true, funcionarios: true },
      },
    },
  });

  const resposta = empresas.map((empresa) => ({
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia,
    cnpj: empresa.cnpj,
    cidadeUF: empresa.cidadeUF,
    setoresCount: empresa._count.setores,
    funcionariosCount: empresa._count.funcionarios,
  }));

  return NextResponse.json(resposta);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { razaoSocial, nomeFantasia, cnpj, cidadeUF } = body;

  if (!razaoSocial || !cnpj) {
    return NextResponse.json(
      { error: 'razaoSocial e cnpj são obrigatórios' },
      { status: 400 }
    );
  }

  const empresa = await prisma.empresa.create({
    data: { razaoSocial, nomeFantasia, cnpj, cidadeUF },
  });

  return NextResponse.json(
    { ...empresa, setoresCount: 0, funcionariosCount: 0 },
    { status: 201 }
  );
}
