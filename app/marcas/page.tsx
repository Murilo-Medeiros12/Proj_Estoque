import { prisma } from "@/lib/prisma";
import { criarMarca, criarModelo, excluirMarca, excluirModelo } from "@/lib/actions";
import Del from "@/components/Del";
import { btn, card, input } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Marcas() {
  const [marcas, modelos] = await Promise.all([
    prisma.marca.findMany({ orderBy: { nome: "asc" } }),
    prisma.modelo.findMany({ include: { marca: true }, orderBy: { nome: "asc" } }),
  ]);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className={card}>
        <h2 className="font-bold mb-3">Marcas</h2>
        <form action={criarMarca} className="flex gap-2 mb-3">
          <input name="nome" required placeholder="Nova marca" className={input} />
          <button className={btn}>Adicionar</button>
        </form>
        <ul>{marcas.map((m) => <li key={m.id} className="flex justify-between py-2 border-t">{m.nome}<Del action={excluirMarca} id={m.id} /></li>)}</ul>
      </section>
      <section className={card}>
        <h2 className="font-bold mb-3">Modelos</h2>
        <form action={criarModelo} className="flex gap-2 mb-3">
          <select name="marcaId" required className={input}>
            <option value="">Marca</option>
            {marcas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <input name="nome" required placeholder="Novo modelo" className={input} />
          <button className={btn}>Adicionar</button>
        </form>
        <ul>{modelos.map((m) => <li key={m.id} className="flex justify-between py-2 border-t">{m.marca.nome} / {m.nome}<Del action={excluirModelo} id={m.id} /></li>)}</ul>
      </section>
    </div>
  );
}