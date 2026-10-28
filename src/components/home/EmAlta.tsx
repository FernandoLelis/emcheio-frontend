import Link from "next/link";
import type { Oferta } from "@/types";

interface EmAltaProps {
  ofertas: Oferta[];
}

export function EmAlta({ ofertas }: EmAltaProps) {
  if (ofertas.length === 0) {
    return null;
  }

  return (
    <section className="border-b-2 border-gray-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <TrendingUpIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl md:text-3xl">
                Em Alta
              </h2>
            </div>
            <p className="ml-8 text-xs text-text-secondary sm:ml-10 sm:text-sm">
              Os produtos mais procurados da semana
            </p>
          </div>

          <Link
            href="/em-alta"
            className="gradient-brand-text hover-magenta-text hidden whitespace-nowrap text-sm font-semibold sm:inline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ofertas.map((oferta, index) => (
            <ProdutoEmAltaCard
              key={oferta.id}
              oferta={oferta}
              posicao={index + 1}
            />
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/em-alta"
            className="gradient-brand-text hover-magenta-text text-sm font-semibold"
          >
            Ver todos →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProdutoEmAltaCard({
  oferta,
  posicao,
}: {
  oferta: Oferta;
  posicao: number;
}) {
  const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const TENDENCIAS_MOCK = [32, 28, 24, 21];
  const tendencia = TENDENCIAS_MOCK[posicao - 1] || 20;

  const nomeProduto = oferta.produto?.nome || "Produto sem nome";
  const imagemUrl =
    oferta.produto?.imagemUrl || "https://placehold.co/300x300?text=Sem+Imagem";
  const slugProduto = oferta.produto?.slug || "";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-3 text-center shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] transition-all hover:border-brand-magenta/40 hover:shadow-md sm:p-4">
      {/* ✅ Badge de ranking AGORA VERDE */}
      <span className="bg-success absolute left-3 top-3 z-10 rounded-md px-2 py-0.5 text-xs font-bold text-white">
        #{posicao}
      </span>

      <div className="relative aspect-square w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagemUrl}
          alt={nomeProduto}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          href={`/produto/${slugProduto}`}
          className="hover-gradient-text line-clamp-2 text-xs font-semibold leading-snug text-text-primary sm:text-sm"
        >
          {nomeProduto}
        </Link>

        <div className="mt-auto pt-2">
          <p className="text-lg font-extrabold text-success sm:text-xl">
            {formatarPreco(Number(oferta.precoAtual))}
          </p>

          <div className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-success">
            <TrendingArrowIcon />
            <span>+{tendencia}% esta semana</span>
          </div>

          <Link
            href={`/produto/${slugProduto}`}
            className="gradient-brand mt-3 flex items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Ver Produto
          </Link>
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon({ className = "" }: { className?: string }) {
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
        <linearGradient id="trending-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF0080" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      <polyline
        points="22 7 13.5 15.5 8.5 10.5 2 17"
        stroke="url(#trending-gradient)"
      />
      <polyline points="16 7 22 7 22 13" stroke="url(#trending-gradient)" />
    </svg>
  );
}

function TrendingArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}