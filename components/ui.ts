export const input = "border border-gray-300 rounded px-3 py-2 w-full bg-white";
export const btn = "bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 cursor-pointer inline-block";
export const card = "bg-white rounded-lg shadow p-4";
export const tabela =
  "w-full bg-white rounded-lg shadow text-sm [&_th]:text-left [&_th]:p-3 [&_td]:p-3 [&_tbody_tr]:border-t";

type Pos = { nome: string; localizacao: { nome: string } } | null;
export const pos = (p: Pos) => (p ? `${p.localizacao.nome} / ${p.nome}` : "—");

// include padrão para buscar movimentações com origem, destino e funcionário
export const incMov = {
  produto: true,
  funcionario: true,
  origem: { include: { localizacao: true } },
  destino: { include: { localizacao: true } },
} as const;