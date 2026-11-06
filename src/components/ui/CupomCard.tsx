"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Cupom } from "@/types";
import { StoreLogo } from "./StoreLogo";

interface CupomCardProps {
  cupom: Cupom;
}

export function CupomCard({ cupom }: CupomCardProps) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(cupom.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const usarCupom = () => {
    if (cupom.urlAfiliado) {
      window.open(cupom.urlAfiliado, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] transition-all hover:border-brand-magenta/40 hover:shadow-md">
      <div className="flex items-center justify-center pb-3">
        <StoreLogo loja={cupom.loja} />
      </div>

      {/* ✅ Desconto com limite de 2 linhas e altura fixa */}
      <div className="flex min-h-[3.5rem] items-center justify-center text-center">
        <p className="gradient-brand-text line-clamp-2 text-xl font-bold leading-tight" title={cupom.descontoTexto || "DESCONTO"}>
          {cupom.descontoTexto || "DESCONTO"}
        </p>
      </div>

      {/* ✅ Condições com limite de 2 linhas e altura fixa */}
      <div className="mt-2 flex min-h-[2.5rem] items-start justify-center text-center">
        {cupom.condicoes ? (
          <p className="line-clamp-2 text-xs font-semibold text-text-secondary" title={cupom.condicoes}>
            {cupom.condicoes}
          </p>
        ) : (
          <span className="text-xs italic text-gray-400">Sem restrições específicas</span>
        )}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={copiarCodigo}
          className="group/codigo relative flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-3 py-2 transition-colors hover:border-brand-magenta/40 hover:bg-brand-magenta/5"
        >
          <span className="truncate font-sans text-sm font-bold tracking-wide text-text-primary">
            {cupom.codigo}
          </span>
          <span className="absolute right-3 text-text-secondary transition-colors group-hover/codigo:text-brand-magenta">
            {copiado ? (
              <Check className="h-4 w-4 text-success" strokeWidth={2.5} />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </span>
        </button>
      </div>

      <div className="mt-auto">
        <div className="mt-1 flex h-4 items-center justify-center">
          {copiado && (
            <p className="text-center text-xs font-semibold text-success">
              Copiado!
            </p>
          )}
        </div>

        <div className="mt-1 flex h-4 items-center justify-center">
          {cupom.validadeFim && (
            <p className="text-center text-xs text-text-secondary">
              Válido até{" "}
              {new Date(cupom.validadeFim).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={usarCupom}
          disabled={!cupom.urlAfiliado}
          className="gradient-brand mt-3 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Usar Cupom
        </button>
      </div>
    </div>
  );
}