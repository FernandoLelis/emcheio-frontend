"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function BotaoCopiarCupom({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button
      onClick={copiar}
      className="flex items-center gap-1 rounded bg-brand-orange/10 px-2 py-1 text-xs font-semibold text-brand-orange transition-colors hover:bg-brand-orange/20"
      title="Copiar código"
    >
      {copiado ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copiado ? "Copiado!" : "Copiar"}
    </button>
  );
}