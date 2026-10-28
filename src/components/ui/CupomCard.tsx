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
      {/* Logo da loja */}
      <div className="flex items-center justify-center pb-3">
        <StoreLogo loja={cupom.loja} />
      </div>

      {/* Desconto */}
      <div className="text-center">
        <p className="gradient-brand-text text-2xl font-bold">
          {cupom.descontoTexto || "DESCONTO"}
        </p>
        {cupom.descricao && (
          <p className="mt-1 text-xs font-semibold text-text-secondary">
            {cupom.descricao}
          </p>
        )}
      </div>

      {/* Código copiável */}
      <div className="mt-4">
        <button
          type="button"
          onClick={copiarCodigo}
          className="group/codigo relative flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-3 py-2 transition-colors hover:border-brand-magenta/40 hover:bg-brand-magenta/5"
        >
          <span className="font-sans text-sm font-bold tracking-wide text-text-primary">
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

      {/* Espaço reservado para "Copiado!" */}
      <div className="mt-1 h-4">
        {copiado && (
          <p className="text-center text-xs font-semibold text-success">
            Copiado!
          </p>
        )}
      </div>

      {/* Validade */}
      <div className="mt-2 h-4">
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

      {/* Botão Usar Cupom */}
      <button
        type="button"
        onClick={usarCupom}
        disabled={!cupom.urlAfiliado}
        className="gradient-brand mt-3 flex items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Usar Cupom
      </button>
    </div>
  );
}