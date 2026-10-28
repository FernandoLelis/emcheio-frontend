"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, Mail, MessageCircle, Check, X } from "lucide-react";
import { inscritoService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Inscrito } from "@/types";

export default function AdminInscritosPage() {
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarInscritos = async () => {
    setCarregando(true);
    setErro("");
    try {
      const data = await inscritoService.listar();
      // Ordenar do mais recente para o mais antigo
      const ordenados = data.sort(
        (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      );
      setInscritos(ordenados);
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao carregar a lista de inscritos.");
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarInscritos();
  }, []);

  const handleExcluir = async (id: number, email: string) => {
    if (!confirm(`Tem certeza que deseja remover o inscrito "${email}"?`)) {
      return;
    }

    try {
      await inscritoService.remover(id);
      setInscritos((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Erro ao excluir: ${error.message}`);
      } else {
        alert("Erro inesperado ao excluir o inscrito.");
      }
    }
  };

  // ✅ Corrigido: toLocaleString para exibir data E hora corretamente
  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Inscritos</h1>
          <p className="text-sm text-text-secondary">
            Lista de pessoas inscritas na newsletter do EmCheio.
          </p>
        </div>
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
      ) : inscritos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-text-secondary">
          Nenhum inscrito cadastrado ainda.
        </div>
      ) : (
        <>
          {/* ✅ VISÃO MOBILE: Cards empilhados (Oculto no Desktop) */}
          <div className="flex flex-col gap-4 md:hidden">
            {inscritos.map((inscrito) => (
              <div
                key={inscrito.id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm"
              >
                {/* Topo: Nome + Data */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary line-clamp-1">
                      {inscrito.nome || (
                        <span className="italic text-gray-400">Não informado</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatarData(inscrito.criadoEm)}
                    </p>
                  </div>
                </div>

                {/* Meio: Contato (E-mail e WhatsApp) */}
                <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-3 text-sm">
                  <span className="flex items-center gap-2 text-text-primary">
                    <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{inscrito.email}</span>
                  </span>
                  {inscrito.whatsapp && (
                    <span className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">{inscrito.whatsapp}</span>
                    </span>
                  )}
                </div>

                {/* Preferências */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      inscrito.aceitaEmail
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {inscrito.aceitaEmail ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    E-mail
                  </span>
                  <span
                    className={`flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      inscrito.aceitaWhatsapp
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {inscrito.aceitaWhatsapp ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    WhatsApp
                  </span>
                </div>

                {/* Rodapé: Ações */}
                <div className="flex">
                  <button
                    onClick={() => handleExcluir(inscrito.id, inscrito.email)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover Inscrito
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
                    <th className="px-6 py-4 font-bold">Nome</th>
                    <th className="px-6 py-4 font-bold">Contato</th>
                    <th className="px-6 py-4 font-bold">Preferências</th>
                    <th className="px-6 py-4 font-bold">Data de Inscrição</th>
                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inscritos.map((inscrito) => (
                    <tr
                      key={inscrito.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold text-text-primary">
                        {inscrito.nome || (
                          <span className="italic text-gray-400">Não informado</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-text-primary">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {inscrito.email}
                          </span>
                          {inscrito.whatsapp && (
                            <span className="flex items-center gap-2 text-gray-500">
                              <MessageCircle className="h-4 w-4 text-gray-400" />
                              {inscrito.whatsapp}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              inscrito.aceitaEmail
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {inscrito.aceitaEmail ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            E-mail
                          </span>
                          <span
                            className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                              inscrito.aceitaWhatsapp
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {inscrito.aceitaWhatsapp ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            WhatsApp
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        {formatarData(inscrito.criadoEm)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleExcluir(inscrito.id, inscrito.email)
                            }
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Remover Inscrito"
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