"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { cupomService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Cupom } from "@/types";
import { StoreLogo } from "@/components/ui/StoreLogo";

export default function AdminCuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarCupons = async () => {
    setCarregando(true);
    setErro("");
    try {
      // Para o admin, listamos TODOS os cupons (inclusive vencidos)
      const data = await cupomService.listar();
      setCupons(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao carregar a lista de cupons.");
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCupons();
  }, []);

  const handleExcluir = async (id: number, codigo: string) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir o cupom "${codigo}"?`
      )
    ) {
      return;
    }

    try {
      await cupomService.remover(id);
      setCupons((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Erro ao excluir: ${error.message}`);
      } else {
        alert("Erro inesperado ao excluir o cupom.");
      }
    }
  };

  // Função para formatar datas em DD/MM/YYYY HH:mm
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para determinar o status do cupom
  const getStatusCupom = (cupom: Cupom) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

    const inicio = cupom.validadeInicio ? new Date(cupom.validadeInicio) : null;
    const fim = cupom.validadeFim ? new Date(cupom.validadeFim) : null;

    if (fim && fim < hoje) {
      return { label: "Vencido", color: "bg-red-100 text-red-700" };
    }
    if (inicio && inicio > hoje) {
      return { label: "Futuro", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "Ativo", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Cupons</h1>
          <p className="text-sm text-text-secondary">
            Gerencie os cupons de desconto das lojas.
          </p>
        </div>

        <Link
          href="/admin/cupons/novo"
          className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Novo Cupom
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
      ) : cupons.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-text-secondary">
          Nenhum cupom cadastrado ainda.
        </div>
      ) : (
        <>
          {/* ✅ VISÃO MOBILE: Cards empilhados (Oculto no Desktop) */}
          <div className="flex flex-col gap-4 md:hidden">
            {cupons.map((cupom) => {
              const status = getStatusCupom(cupom);
              return (
                <div
                  key={cupom.id}
                  className="flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm"
                >
                  {/* Topo: Loja + Código/Desconto */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex w-fit min-w-[80px] items-center justify-start">
                      <StoreLogo loja={cupom.loja} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-mono text-lg font-bold text-text-primary">
                        {cupom.codigo}
                      </span>
                      <span className="text-xs font-semibold text-brand-magenta">
                        {cupom.descontoTexto || "Desconto"}
                      </span>
                    </div>
                  </div>

                  {/* Meio: Validade */}
                  <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Início:</span>
                      <span className="font-medium text-text-primary">
                        {cupom.validadeInicio ? formatarData(cupom.validadeInicio) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Fim:</span>
                      <span className="font-medium text-text-primary">
                        {cupom.validadeFim ? formatarData(cupom.validadeFim) : "-"}
                      </span>
                    </div>
                    {!cupom.validadeInicio && !cupom.validadeFim && (
                      <span className="mt-1 text-center text-gray-400">
                        Sem validade
                      </span>
                    )}
                  </div>

                  {/* Status: Destaque + Ativo/Vencido/Futuro */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${status.color}`}
                    >
                      {status.label}
                    </span>
                    {cupom.destaque && (
                      <span className="w-fit rounded-full bg-brand-magenta/10 px-2 py-0.5 text-[10px] font-bold text-brand-magenta">
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Rodapé: Ações */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/cupons/${cupom.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluir(cupom.id, cupom.codigo)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ VISÃO DESKTOP: Tabela Tradicional (Oculto no Mobile) */}
          <div className="hidden w-full overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-secondary">
                <thead className="border-b-2 border-gray-100 bg-gray-50 text-xs uppercase text-text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">Loja</th>
                    <th className="px-6 py-4 font-bold">Código / Desconto</th>
                    <th className="px-6 py-4 font-bold">Validade</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cupons.map((cupom) => {
                    const status = getStatusCupom(cupom);
                    return (
                      <tr
                        key={cupom.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex w-fit min-w-[100px] items-center justify-start">
                            <StoreLogo loja={cupom.loja} />
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-text-primary">
                              {cupom.codigo}
                            </span>
                            <span className="text-xs font-semibold text-brand-magenta">
                              {cupom.descontoTexto || "Desconto"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs">
                          {cupom.validadeInicio && (
                            <div>De: {formatarData(cupom.validadeInicio)}</div>
                          )}
                          {cupom.validadeFim && (
                            <div>Até: {formatarData(cupom.validadeFim)}</div>
                          )}
                          {!cupom.validadeInicio && !cupom.validadeFim && (
                            <span className="text-gray-400">Sem validade</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${status.color}`}
                            >
                              {status.label}
                            </span>
                            {cupom.destaque && (
                              <span className="w-fit rounded-full bg-brand-magenta/10 px-2 py-0.5 text-[10px] font-bold text-brand-magenta">
                                Destaque
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/cupons/${cupom.id}`}
                              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-magenta"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleExcluir(cupom.id, cupom.codigo)}
                              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}