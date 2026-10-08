import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Movs from "@/components/Movs";
import { card, incMov } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const agora = new Date();
  const [total, estoque, saidas, ultimas] = await Promise.all([
    prisma.produto.count(),
    prisma.produto.count({ where: { status: "EM_ESTOQUE" } }),
    prisma.movimentacao.count({ where: { tipo: "SAIDA", data: { gte: new Date(agora.getFullYear(), agora.getMonth(), 1) } } }),
    prisma.movimentacao.findMany({ take: 10, orderBy: { data: "desc" }, include: incMov }),
  ]);
  const cards = [["Produtos cadastrados", total], ["Em estoque", estoque], ["Saídas no mês", saidas]];
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Início</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map(([t, v]) => (
          <div key={t} className={card}><p className="text-3xl font-bold">{v}</p><p className="text-gray-500">{t}</p></div>
        ))}
      </div>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Últimas movimentações</h2>
        <Link href="/movimentacoes" className="text-blue-600">Ver todas</Link>
      </div>
      <Movs lista={ultimas} />
    </>
  );
}