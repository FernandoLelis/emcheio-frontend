"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface BotaoCompartilharProps {
  titulo: string;
  preco: string;
}

export function BotaoCompartilhar({ titulo, preco }: BotaoCompartilharProps) {
  const [urlAtual, setUrlAtual] = useState("");

  useEffect(() => {
    setUrlAtual(window.location.href);
  }, []);

  const compartilhar = () => {
    if (!urlAtual) return;

    const mensagem = `Olha essa oferta que eu achei no EmCheio!\n\n*${titulo}*\nPor apenas *${preco}*\n\nConfira aqui: ${urlAtual}`;
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    
    window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={compartilhar}
      className="flex w-fit items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700 transition-colors hover:bg-green-100"
      title="Compartilhar no WhatsApp"
    >
      <Share2 className="h-4 w-4" />
      Compartilhar
    </button>
  );
}