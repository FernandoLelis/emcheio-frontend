"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { categoriaService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Categoria } from "@/types";
import { CategoriaModal } from "@/components/admin/CategoriaModal";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<Categoria | null>(null);

  const carregarCategorias = async () => {
    setCarregando(true);
    setErro("");
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao carregar a lista de categorias.");
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleNovaCategoria = () => {
    setCategoriaParaEditar(null);
    setIsModalOpen(true);
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaParaEditar(categoria);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setCategoriaParaEditar(null);
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir a categoria "${nome}"?\n\nOs produtos vinculados a ela ficarão "Sem categoria".`
      )
    ) {
      return;
    }

    try {
      await categoriaService.remover(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Erro ao excluir: ${error.message}`);
      } else {
        alert("Erro inesperado ao excluir a categoria.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Categorias</h1>
          <p className="text-sm text-text-secondary">
            Gerencie as categorias de produtos do EmCheio.
          </p>
        </div>

        <button
          onClick={handleNovaCategoria}
          className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
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
      ) : categorias.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-text-secondary">
          Nenhuma categoria cadastrada ainda.
        </div>
      ) : (
        <>
          {/* ✅ VISÃO MOBILE: Cards (Oculto no Desktop) */}
          <div className="flex flex-col gap-4 md:hidden">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm"
              >
                {/* Topo: Ícone + Nome */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-brand-magenta">
                    <CategoryIcon icone={categoria.icone} className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary">
                      {categoria.nome}
                    </p>
                    <p className="text-xs font-mono text-gray-400">
                      /{categoria.slug}
                    </p>
                  </div>
                </div>

                {/* Meio: Contagem de Produtos */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs">
                  <span className="text-gray-500">Produtos vinculados</span>
                  <span className="font-bold text-text-primary">
                    {categoria._count?.produtos || 0}
                  </span>
                </div>

                {/* Rodapé: Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditarCategoria(categoria)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(categoria.id, categoria.nome)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ VISÃO DESKTOP: Tabela (Oculto no Mobile) */}
          <div className="hidden w-full overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-secondary">
                <thead className="border-b-2 border-gray-100 bg-gray-50 text-xs uppercase text-text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">Ícone</th>
                    <th className="px-6 py-4 font-bold">Nome</th>
                    <th className="px-6 py-4 font-bold">Slug</th>
                    <th className="px-6 py-4 font-bold">Produtos</th>
                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categorias.map((categoria) => (
                    <tr
                      key={categoria.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-brand-magenta">
                          <CategoryIcon icone={categoria.icone} className="h-6 w-6" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-primary">
                        {categoria.nome}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">
                        /{categoria.slug}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {categoria._count?.produtos || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditarCategoria(categoria)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-magenta"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluir(categoria.id, categoria.nome)}
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

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={handleFecharModal}
        onSuccess={carregarCategorias}
        categoriaParaEditar={categoriaParaEditar}
      />
    </div>
  );
}