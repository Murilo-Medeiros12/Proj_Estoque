import { prisma } from "@/lib/prisma";
import { criarLocalizacao, criarPosicao, excluirLocalizacao, excluirPosicao } from "@/lib/actions";
import Del from "@/components/Del";
import { btn, card, input } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Localizacoes() {
  const [locais, posicoes] = await Promise.all([
    prisma.localizacao.findMany({ orderBy: { nome: "asc" } }),
    prisma.posicao.findMany({ include: { localizacao: true }, orderBy: { nome: "asc" } }),
  ]);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className={card}>
        <h2 className="font-bold mb-3">Localizações</h2>
        <form action={criarLocalizacao} className="flex gap-2 mb-3">
          <input name="nome" required placeholder="Ex.: Sala 2, Almoxarifado" className={input} />
          <button className={btn}>Adicionar</button>
        </form>
        <ul>{locais.map((l) => <li key={l.id} className="flex justify-between py-2 border-t">{l.nome}<Del action={excluirLocalizacao} id={l.id} /></li>)}</ul>
      </section>
      <section className={card}>
        <h2 className="font-bold mb-3">Posições</h2>
        <form action={criarPosicao} className="flex gap-2 mb-3">
          <select name="localizacaoId" required className={input}>
            <option value="">Localização</option>
            {locais.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
          <input name="nome" required placeholder="Ex.: Prateleira A3" className={input} />
          <button className={btn}>Adicionar</button>
        </form>
        <ul>{posicoes.map((p) => <li key={p.id} className="flex justify-between py-2 border-t">{p.localizacao.nome} / {p.nome}<Del action={excluirPosicao} id={p.id} /></li>)}</ul>
      </section>
    </div>
  );
}