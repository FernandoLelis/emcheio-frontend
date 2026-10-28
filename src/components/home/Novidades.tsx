import Link from "next/link";
import type { Produto } from "@/types";

interface NovidadesProps {
  produtos: Produto[];
}

export function Novidades({ produtos }: NovidadesProps) {
  if (produtos.length === 0) {
    return null;
  }

  return (
    <section className="border-b-2 border-gray-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <NewIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl md:text-3xl">
                Novidades
              </h2>
            </div>
            <p className="ml-8 text-xs text-text-secondary sm:ml-10 sm:text-sm">
              Acabaram de chegar
            </p>
          </div>

          <Link
            href="/novidades"
            className="gradient-brand-text hover-magenta-text hidden whitespace-nowrap text-sm font-semibold sm:inline"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {produtos.map((produto) => (
            <ProdutoNovidadeCard key={produto.id} produto={produto} />
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/novidades"
            className="gradient-brand-text hover-magenta-text text-sm font-semibold"
          >
            Ver todas →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProdutoNovidadeCard({ produto }: { produto: Produto }) {
  const ofertasDisponiveis = produto.ofertas?.filter((o) => o.disponivel) || [];

  const menorPreco =
    ofertasDisponiveis.length > 0
      ? Math.min(...ofertasDisponiveis.map((o) => Number(o.precoAtual)))
      : null;

  const formatarPreco = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const imagemUrl =
    produto.imagemUrl || "https://placehold.co/300x300?text=Sem+Imagem";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-3 text-center shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] transition-all hover:border-brand-magenta/40 hover:shadow-md sm:p-4">
      {/* ✅ Badge NOVO AGORA VERDE */}
      <span className="bg-success absolute left-3 top-3 z-10 rounded-md px-2 py-0.5 text-xs font-bold text-white">
        NOVO
      </span>

      <div className="relative aspect-square w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagemUrl}
          alt={produto.nome}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          href={`/produto/${produto.slug}`}
          className="hover-gradient-text line-clamp-2 text-xs font-semibold leading-snug text-text-primary sm:text-sm"
        >
          {produto.nome}
        </Link>

        <div className="mt-auto pt-2">
          {menorPreco !== null && (
            <p className="text-lg font-extrabold text-success sm:text-xl">
              {formatarPreco(menorPreco)}
            </p>
          )}

          <Link
            href={`/produto/${produto.slug}`}
            className="gradient-brand mt-3 flex items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Ver Produto
          </Link>
        </div>
      </div>
    </div>
  );
}

function NewIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <linearGradient id="new-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF0080" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      <path
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
        stroke="url(#new-gradient)"
      />
      <path d="M20 3v4" stroke="url(#new-gradient)" />
      <path d="M22 5h-4" stroke="url(#new-gradient)" />
      <path d="M4 17v2" stroke="url(#new-gradient)" />
      <path d="M5 18H3" stroke="url(#new-gradient)" />
    </svg>
  );
}