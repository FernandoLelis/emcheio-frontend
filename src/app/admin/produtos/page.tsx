"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { produtoService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Produto } from "@/types";

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro("");
    try {
      const data = await produtoService.listar();
      setProdutos(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao carregar a lista de produtos.");
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleExcluir = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }

    try {
      await produtoService.remover(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Erro ao excluir: ${error.message}`);
      } else {
        alert("Erro inesperado ao excluir o produto.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Produtos</h1>
          <p className="text-sm text-text-secondary">
            Gerencie os produtos disponíveis no EmCheio.
          </p>
        </div>

        <Link
          href="/admin/produtos/novo"
          className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </div>

      {erro && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-magenta" />
        </div>
      ) : produtos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-text-secondary">
          Nenhum produto cadastrado ainda.
        </div>
      ) : (
        <>
          {/* ✅ VISÃO MOBILE: Cards empilhados (Oculto no Desktop) */}
          <div className="flex flex-col gap-4 md:hidden">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm"
              >
                {/* Topo: Imagem + Nome */}
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      produto.imagemUrl ||
                      "https://placehold.co/100x100?text=Sem+Img"
                    }
                    alt={produto.nome}
                    className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary line-clamp-2">
                      {produto.nome}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{produto.slug}</p>
                  </div>
                </div>

                {/* Meio: Infos (Categoria e Ofertas) */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Categoria</span>
                    <span className="font-medium text-text-primary">
                      {produto.categoria?.nome || "Sem categoria"}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-500">Ofertas</span>
                    <span className="font-medium text-text-primary">
                      {produto.ofertas?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Rodapé: Ações */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/produtos/${produto.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleExcluir(produto.id, produto.nome)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ VISÃO DESKTOP: Tabela Tradicional (Oculto no Mobile) */}
          <div className="hidden w-full overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-secondary">
                <thead className="border-b-2 border-gray-100 bg-gray-50 text-xs uppercase text-text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">Produto</th>
                    <th className="px-6 py-4 font-bold">Categoria</th>
                    <th className="px-6 py-4 font-bold">Ofertas</th>
                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produtos.map((produto) => (
                    <tr
                      key={produto.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              produto.imagemUrl ||
                              "https://placehold.co/100x100?text=Sem+Img"
                            }
                            alt={produto.nome}
                            className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 object-contain p-1"
                          />
                          <div className="max-w-[250px]">
                            <p className="truncate font-semibold text-text-primary">
                              {produto.nome}
                            </p>
                            <p className="truncate text-xs text-gray-400">
                              {produto.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {produto.categoria?.nome || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {produto.ofertas?.length || 0} oferta(s)
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/produtos/${produto.id}`}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-magenta"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleExcluir(produto.id, produto.nome)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}