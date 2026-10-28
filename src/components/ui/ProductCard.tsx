import Link from "next/link";
import type { Oferta } from "@/types";
import { StoreLogo } from "./StoreLogo";

interface ProductCardProps {
  oferta: Oferta;
}

export function ProductCard({ oferta }: ProductCardProps) {
  // ✅ Converte Decimal (string) para number
  const precoAtual = Number(oferta.precoAtual);
  const precoOriginal = oferta.precoOriginal
    ? Number(oferta.precoOriginal)
    : null;

  const desconto =
    precoOriginal && precoOriginal > precoAtual
      ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100)
      : 0;

  const nomeProduto = oferta.produto?.nome || "Produto sem nome";
  const imagemUrl =
    oferta.produto?.imagemUrl || "https://placehold.co/300x300?text=Sem+Imagem";
  const slugProduto = oferta.produto?.slug || "";

  const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-4 text-center shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] transition-all hover:border-brand-magenta/40 hover:shadow-md">
      {/* Imagem + Badge */}
      <div className="relative aspect-square w-full overflow-hidden">
        {desconto > 0 && (
          <span className="absolute left-0 top-0 z-10 rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white">
            -{desconto}%
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagemUrl}
          alt={nomeProduto}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Conteúdo */}
      <div className="mt-3 flex flex-1 flex-col">
        <Link
          href={`/produto/${slugProduto}`}
          className="hover-gradient-text line-clamp-2 text-sm font-semibold leading-snug text-text-primary"
        >
          {nomeProduto}
        </Link>

        <div className="mt-auto pt-2">
          <div className="space-y-0.5">
            {precoOriginal && precoOriginal > precoAtual && (
              <p className="text-xs font-semibold text-text-secondary line-through">
                {formatarPreco(precoOriginal)}
              </p>
            )}
            <p className="text-lg font-extrabold text-success">
              {formatarPreco(precoAtual)}
            </p>
          </div>

          <div className="mt-3 flex flex-1 items-end justify-center">
            <StoreLogo loja={oferta.loja} />
          </div>

          <a
            href={oferta.urlAfiliado}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-brand mt-3 flex items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Ver Oferta
          </a>
        </div>
      </div>
    </div>
  );
}