"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { ofertaService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Oferta } from "@/types";
import { StoreLogo } from "@/components/ui/StoreLogo";

export default function AdminOfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarOfertas = async () => {
    setCarregando(true);
    setErro("");
    try {
      const data = await ofertaService.listar();
      setOfertas(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao carregar a lista de ofertas.");
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarOfertas();
  }, []);

  const handleExcluir = async (id: number, nomeProduto: string, loja: string) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir a oferta do produto "${nomeProduto}" na loja "${loja}"?`
      )
    ) {
      return;
    }

    try {
      await ofertaService.remover(id);
      setOfertas((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Erro ao excluir: ${error.message}`);
      } else {
        alert("Erro inesperado ao excluir a oferta.");
      }
    }
  };

  const formatarPreco = (valor: number | string) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Ofertas</h1>
          <p className="text-sm text-text-secondary">
            Gerencie os preços e links de afiliados dos produtos.
          </p>
        </div>

        <Link
          href="/admin/ofertas/novo"
          className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nova Oferta
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
      ) : ofertas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-text-secondary">
          Nenhuma oferta cadastrada ainda.
        </div>
      ) : (
        <>
          {/* ✅ VISÃO MOBILE: Cards empilhados (Oculto no Desktop) */}
          <div className="flex flex-col gap-4 md:hidden">
            {ofertas.map((oferta) => (
              <div
                key={oferta.id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm"
              >
                {/* Topo: Imagem + Nome + Marca */}
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      oferta.produto?.imagemUrl ||
                      "https://placehold.co/100x100?text=Sem+Img"
                    }
                    alt={oferta.produto?.nome || "Produto"}
                    className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary line-clamp-2">
                      {oferta.produto?.nome || "Produto sem nome"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {oferta.produto?.marca || "Sem marca"}
                    </p>
                  </div>
                </div>

                {/* Meio: Loja + Preços */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Loja</span>
                    <StoreLogo loja={oferta.loja} />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-500">Preço</span>
                    <span className="font-bold text-success">
                      {formatarPreco(oferta.precoAtual)}
                    </span>
                    {oferta.precoOriginal && (
                      <span className="text-gray-400 line-through">
                        {formatarPreco(oferta.precoOriginal)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status: Destaque + Disponibilidade */}
                <div className="flex flex-wrap items-center gap-2">
                  {oferta.destaque && (
                    <span className="flex w-fit items-center gap-1 rounded-full bg-brand-magenta/10 px-2 py-0.5 text-[10px] font-bold text-brand-magenta">
                      <Star className="h-3 w-3 fill-brand-magenta" />
                      Destaque
                    </span>
                  )}
                  <span
                    className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      oferta.disponivel
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {oferta.disponivel ? "Disponível" : "Indisponível"}
                  </span>
                </div>

                {/* Rodapé: Ações */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/ofertas/${oferta.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                  <button
                    onClick={() =>
                      handleExcluir(
                        oferta.id,
                        oferta.produto?.nome || "Produto",
                        oferta.loja
                      )
                    }
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
                    <th className="px-6 py-4 font-bold">Loja</th>
                    <th className="px-6 py-4 font-bold">Preços</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ofertas.map((oferta) => (
                    <tr
                      key={oferta.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              oferta.produto?.imagemUrl ||
                              "https://placehold.co/100x100?text=Sem+Img"
                            }
                            alt={oferta.produto?.nome || "Produto"}
                            className="h-10 w-10 rounded-lg border border-gray-200 object-contain p-1"
                          />
                          <div>
                            <p className="font-semibold text-text-primary line-clamp-1 max-w-[200px]">
                              {oferta.produto?.nome || "Produto sem nome"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {oferta.produto?.marca || "Sem marca"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex w-fit min-w-[100px] items-center justify-start">
                          <StoreLogo loja={oferta.loja} />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-success">
                            {formatarPreco(oferta.precoAtual)}
                          </span>
                          {oferta.precoOriginal && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatarPreco(oferta.precoOriginal)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {oferta.destaque && (
                            <span className="flex w-fit items-center gap-1 rounded-full bg-brand-magenta/10 px-2 py-0.5 text-[10px] font-bold text-brand-magenta">
                              <Star className="h-3 w-3 fill-brand-magenta" />
                              Destaque
                            </span>
                          )}
                          <span
                            className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              oferta.disponivel
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {oferta.disponivel ? "Disponível" : "Indisponível"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/ofertas/${oferta.id}`}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-magenta"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() =>
                              handleExcluir(
                                oferta.id,
                                oferta.produto?.nome || "Produto",
                                oferta.loja
                              )
                            }
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