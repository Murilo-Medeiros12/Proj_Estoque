import { prisma } from "@/lib/prisma";
import Movs from "@/components/Movs";
import { btn, incMov, input } from "@/components/ui";

export const dynamic = "force-dynamic";

type Tipo = "ENTRADA" | "SAIDA" | "MOVIMENTACAO";

export default async function Movimentacoes({ searchParams }: { searchParams: Promise<{ tipo?: string; q?: string }> }) {
  const { tipo = "", q = "" } = await searchParams;
  const lista = await prisma.movimentacao.findMany({
    where: {
      ...(tipo ? { tipo: tipo as Tipo } : {}),
      ...(q ? { produto: { serviceTag: { contains: q } } } : {}),
    },
    orderBy: { data: "desc" },
    take: 200,
    include: incMov,
  });
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Histórico de movimentações</h1>
      <form className="flex gap-2 mb-4">
        <input name="q" defaultValue={q} placeholder="Service tag" className={input} />
        <select name="tipo" defaultValue={tipo} className={input}>
          <option value="">Todos os tipos</option>
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
          <option value="MOVIMENTACAO">Movimentação</option>
        </select>
        <button className={btn}>Filtrar</button>
      </form>
      <Movs lista={lista} />
    </>
  );
}