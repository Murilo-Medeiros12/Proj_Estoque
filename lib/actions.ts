"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const n = (f: FormData, k: string) => Number(f.get(k));
// executa a operação, ignora erro (duplicado ou item em uso) e atualiza a página
const ok = (p: Promise<unknown>, path: string) => p.catch(() => {}).then(() => revalidatePath(path));

export async function criarMarca(f: FormData) {
  return ok(prisma.marca.create({ data: { nome: s(f, "nome") } }), "/marcas");
}
export async function excluirMarca(f: FormData) {
  return ok(prisma.marca.delete({ where: { id: n(f, "id") } }), "/marcas");
}
export async function criarModelo(f: FormData) {
  return ok(prisma.modelo.create({ data: { nome: s(f, "nome"), marcaId: n(f, "marcaId") } }), "/marcas");
}
export async function excluirModelo(f: FormData) {
  return ok(prisma.modelo.delete({ where: { id: n(f, "id") } }), "/marcas");
}
export async function criarLocalizacao(f: FormData) {
  return ok(prisma.localizacao.create({ data: { nome: s(f, "nome") } }), "/localizacoes");
}
export async function excluirLocalizacao(f: FormData) {
  return ok(prisma.localizacao.delete({ where: { id: n(f, "id") } }), "/localizacoes");
}
export async function criarPosicao(f: FormData) {
  return ok(prisma.posicao.create({ data: { nome: s(f, "nome"), localizacaoId: n(f, "localizacaoId") } }), "/localizacoes");
}
export async function excluirPosicao(f: FormData) {
  return ok(prisma.posicao.delete({ where: { id: n(f, "id") } }), "/localizacoes");
}
export async function criarFuncionario(f: FormData) {
  return ok(prisma.funcionario.create({ data: { nome: s(f, "nome"), matricula: s(f, "matricula") || null } }), "/funcionarios");
}
export async function excluirFuncionario(f: FormData) {
  return ok(prisma.funcionario.delete({ where: { id: n(f, "id") } }), "/funcionarios");
}

// Entrada de um produto novo: cria o produto e já registra a movimentação de ENTRADA
export async function criarProduto(f: FormData) {
  const serviceTag = s(f, "serviceTag");
  const ni = s(f, "ni");
  const dup = await prisma.produto.findFirst({ where: { OR: [{ serviceTag }, { ni }] } });
  if (dup) redirect("/produtos/novo?erro=Service tag ou NI já cadastrado");
  const posicaoId = n(f, "posicaoId");
  const funcionarioId = n(f, "funcionarioId");
  const quantidade = Math.max(1, n(f, "quantidade") || 1);
  const p = await prisma.produto.create({
    data: {
      nome: s(f, "nome"), serviceTag, ni, quantidade, modeloId: n(f, "modeloId"), posicaoId,
      movimentacoes: {
        create: { tipo: "ENTRADA", quantidade, destinoPosicaoId: posicaoId, funcionarioId, observacao: "Cadastro inicial" },
      },
    },
  });
  redirect(`/produtos/${p.id}`);
}

// Entrada (repor), saída (parcial ou total) e movimentação (leva o lote todo)
export async function movimentar(f: FormData) {
  const produtoId = n(f, "produtoId");
  const tipo = s(f, "tipo") as "ENTRADA" | "SAIDA" | "MOVIMENTACAO";
  const funcionarioId = n(f, "funcionarioId");
  const p = await prisma.produto.findUniqueOrThrow({ where: { id: produtoId } });
  const voltar = (e: string) => redirect(`/produtos/${produtoId}?erro=${encodeURIComponent(e)}`);
  const fora = p.status === "SAIU";
  const pedida = Math.max(1, n(f, "quantidade") || 1);

  if (!funcionarioId) voltar("Escolha o funcionário responsável");
  if (tipo !== "ENTRADA" && fora) voltar("Este produto já saiu do estoque");

  let qtd = pedida;
  let total = p.quantidade;
  let destino: number | null = p.posicaoId;

  if (tipo === "ENTRADA") {
    if (fora) {
      destino = n(f, "destinoPosicaoId") || null;
      if (!destino) voltar("Escolha a posição de destino");
      total = pedida;
    } else {
      total = p.quantidade + pedida;
    }
  } else if (tipo === "SAIDA") {
    if (pedida > p.quantidade) voltar(`Só há ${p.quantidade} unidade(s) em estoque`);
    total = p.quantidade - pedida;
    if (total === 0) destino = null;
  } else {
    qtd = p.quantidade;
    destino = n(f, "destinoPosicaoId") || null;
    if (!destino) voltar("Escolha a posição de destino");
  }

  await prisma.$transaction([
    prisma.movimentacao.create({
      data: {
        tipo, quantidade: qtd, produtoId, funcionarioId,
        origemPosicaoId: tipo === "ENTRADA" ? null : p.posicaoId,
        destinoPosicaoId: tipo === "SAIDA" ? null : destino,
        observacao: s(f, "observacao") || null,
      },
    }),
    prisma.produto.update({
      where: { id: produtoId },
      data: { quantidade: total, posicaoId: destino, status: total === 0 ? "SAIU" : "EM_ESTOQUE" },
    }),
  ]);
  redirect(`/produtos/${produtoId}`);
}