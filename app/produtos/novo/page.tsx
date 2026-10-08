import { prisma } from "@/lib/prisma";
import { criarProduto } from "@/lib/actions";
import { btn, input, pos } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NovoProduto({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const [modelos, posicoes, funcionarios] = await Promise.all([
    prisma.modelo.findMany({ include: { marca: true }, orderBy: { nome: "asc" } }),
    prisma.posicao.findMany({ include: { localizacao: true }, orderBy: { nome: "asc" } }),
    prisma.funcionario.findMany({ orderBy: { nome: "asc" } }),
  ]);
  return (
    <form action={criarProduto} className="max-w-lg space-y-3">
      <h1 className="text-2xl font-bold">Novo produto (entrada)</h1>
      {erro && <p className="text-red-600">{erro}</p>}
      <input name="nome" placeholder="Nome do produto" required className={input} />
      <select name="modeloId" required className={input}>
        <option value="">Marca / Modelo</option>
        {modelos.map((m) => <option key={m.id} value={m.id}>{m.marca.nome} / {m.nome}</option>)}
      </select>
      <input name="serviceTag" placeholder="Service tag" required className={input} />
      <input name="ni" placeholder="NI" required className={input} />
      <input name="quantidade" type="number" min={1} defaultValue={1} required className={input} />
      <select name="posicaoId" required className={input}>
        <option value="">Localização / Posição</option>
        {posicoes.map((p) => <option key={p.id} value={p.id}>{pos(p)}</option>)}
      </select>
      <select name="funcionarioId" required className={input}>
        <option value="">Funcionário responsável</option>
        {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
      </select>
      {funcionarios.length === 0 && <p className="text-gray-500 text-sm">Cadastre um funcionário em /funcionarios antes de salvar.</p>}
      <button className={btn}>Salvar produto</button>
    </form>
  );
}