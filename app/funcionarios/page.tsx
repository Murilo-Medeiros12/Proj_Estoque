import { prisma } from "@/lib/prisma";
import { criarFuncionario, excluirFuncionario } from "@/lib/actions";
import Del from "@/components/Del";
import { btn, card, input } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Funcionarios() {
  const lista = await prisma.funcionario.findMany({ orderBy: { nome: "asc" } });
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Funcionários</h1>
      <section className={card}>
        <form action={criarFuncionario} className="flex gap-2 mb-3">
          <input name="nome" required placeholder="Nome do funcionário" className={input} />
          <input name="matricula" placeholder="Matrícula (opcional)" className={input} />
          <button className={btn}>Adicionar</button>
        </form>
        <ul>
          {lista.map((f) => (
            <li key={f.id} className="flex justify-between py-2 border-t">
              <span>{f.nome}{f.matricula && <span className="text-gray-500"> · {f.matricula}</span>}</span>
              <Del action={excluirFuncionario} id={f.id} />
            </li>
          ))}
        </ul>
        {lista.length === 0 && <p className="text-gray-500">Nenhum funcionário cadastrado.</p>}
        <p className="text-gray-500 text-sm mt-3">Funcionário com movimentações registradas não pode ser excluído.</p>
      </section>
    </div>
  );
}