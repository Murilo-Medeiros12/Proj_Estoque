import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { movimentar } from "@/lib/actions";
import Movs from "@/components/Movs";
import { btn, card, incMov, input, pos } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Produto({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string }> }) {
  const { id } = await params;
  const { erro } = await searchParams;
  const p = await prisma.produto.findUnique({
    where: { id: Number(id) },
    include: { modelo: { include: { marca: true } }, posicao: { include: { localizacao: true } } },
  });
  if (!p) notFound();
  const [historico, posicoes, funcionarios] = await Promise.all([
    prisma.movimentacao.findMany({ where: { produtoId: p.id }, orderBy: { data: "desc" }, include: incMov }),
    prisma.posicao.findMany({ include: { localizacao: true }, orderBy: { nome: "asc" } }),
    prisma.funcionario.findMany({ orderBy: { nome: "asc" } }),
  ]);
  const fora = p.status === "SAIU";
  const dados = [
    ["Marca", p.modelo.marca.nome], ["Modelo", p.modelo.nome], ["Service tag", p.serviceTag], ["NI", p.ni],
    ["Quantidade", String(p.quantidade)],
    ["Posição atual", fora ? "Fora do estoque" : pos(p.posicao)],
  ];
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{p.nome}</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className={card}>
          <dl className="space-y-1">
            {dados.map(([k, v]) => <div key={k} className="flex gap-2"><dt className="text-gray-500 w-32">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <form action={movimentar} className={`${card} space-y-2`}>
          <h2 className="font-bold">Registrar movimentação</h2>
          {erro && <p className="text-red-600">{erro}</p>}
          <input type="hidden" name="produtoId" value={p.id} />
          <select name="tipo" className={input}>
            {fora ? <option value="ENTRADA">Entrada (volta ao estoque)</option> : (
              <>
                <option value="MOVIMENTACAO">Movimentação (leva todo o lote para outra posição)</option>
                <option value="SAIDA">Saída</option>
                <option value="ENTRADA">Entrada (repor quantidade)</option>
              </>
            )}
          </select>
          <input name="quantidade" type="number" min={1} defaultValue={1} className={input} />
          <p className="text-gray-500 text-xs">Quantidade vale para saída e entrada. Na movimentação vai o lote todo.</p>
          <select name="destinoPosicaoId" className={input}>
            <option value="">Posição de destino (só movimentação ou produto que saiu)</option>
            {posicoes.map((x) => <option key={x.id} value={x.id}>{pos(x)}</option>)}
          </select>
          <select name="funcionarioId" required className={input}>
            <option value="">Funcionário responsável</option>
            {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
          <input name="observacao" placeholder="Observação" className={input} />
          <button className={btn}>Registrar</button>
        </form>
      </div>
      <h2 className="text-xl font-bold mb-3">Histórico</h2>
      <Movs lista={historico} mostrarProduto={false} />
    </>
  );
}