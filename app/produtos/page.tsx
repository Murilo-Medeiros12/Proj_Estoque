import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { btn, input, pos, tabela } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Produtos({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const lista = await prisma.produto.findMany({
    where: q ? { OR: [{ serviceTag: { contains: q } }, { ni: { contains: q } }, { nome: { contains: q } }] } : {},
    include: { modelo: { include: { marca: true } }, posicao: { include: { localizacao: true } } },
    orderBy: { id: "desc" },
  });
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/produtos/novo" className={btn}>+ Novo produto</Link>
      </div>
      <form className="flex gap-2 mb-4">
        <input name="q" defaultValue={q} placeholder="Buscar por service tag, NI ou nome" className={input} />
        <button className={btn}>Buscar</button>
      </form>
      <table className={tabela}>
        <thead>
          <tr><th>ID</th><th>Produto</th><th>Marca</th><th>Modelo</th><th>Service tag</th><th>NI</th><th>Posição</th><th>Status</th></tr>
        </thead>
        <tbody>
          {lista.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><Link className="text-blue-600" href={`/produtos/${p.id}`}>{p.nome}</Link></td>
              <td>{p.modelo.marca.nome}</td>
              <td>{p.modelo.nome}</td>
              <td>{p.serviceTag}</td>
              <td>{p.ni}</td>
              <td>{pos(p.posicao)}</td>
              <td>{p.status === "SAIU" ? "Saiu" : "Em estoque"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {lista.length === 0 && <p className="text-gray-500 mt-4">Nenhum produto encontrado.</p>}
    </>
  );
}