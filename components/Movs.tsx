import Link from "next/link";
import { pos, tabela } from "./ui";

type P = { nome: string; localizacao: { nome: string } } | null;
type Mov = {
  id: number; tipo: string; quantidade: number; data: Date; observacao: string | null;
  produto: { id: number; serviceTag: string }; funcionario: { nome: string }; origem: P; destino: P;
};
const rotulo: Record<string, string> = { ENTRADA: "Entrada", SAIDA: "Saída", MOVIMENTACAO: "Movimentação" };

export default function Movs({ lista, mostrarProduto = true }: { lista: Mov[]; mostrarProduto?: boolean }) {
  if (lista.length === 0) return <p className="text-gray-500">Nenhuma movimentação registrada.</p>;
  return (
    <table className={tabela}>
      <thead>
        <tr>
          <th>Data</th>
          {mostrarProduto && <th>Service tag</th>}
          <th>Tipo</th><th>Qtd.</th><th>Origem</th><th>Destino</th><th>Funcionário</th><th>Observação</th>
        </tr>
      </thead>
      <tbody>
        {lista.map((m) => (
          <tr key={m.id}>
            <td>{new Date(m.data).toLocaleString("pt-BR")}</td>
            {mostrarProduto && (
              <td><Link className="text-blue-600" href={`/produtos/${m.produto.id}`}>{m.produto.serviceTag}</Link></td>
            )}
            <td>{rotulo[m.tipo]}</td>
            <td>{m.quantidade}</td>
            <td>{pos(m.origem)}</td>
            <td>{pos(m.destino)}</td>
            <td>{m.funcionario.nome}</td>
            <td>{m.observacao ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}