import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ofertaService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Oferta } from "@/types";

// ==========================================
// METADATA (SEO)
// ==========================================
export const metadata = {
  title: "Em Alta — EmCheio",
  description:
    "Os produtos com os maiores descontos do momento. Não perca as melhores oportunidades.",
};

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function EmAltaPage() {
  let ofertas: Oferta[] = [];

  try {
    const todas = await ofertaService.listar();
    // Filtra disponíveis com desconto e ordena por MAIOR desconto
    ofertas = todas
      .filter(
        (o) => o.disponivel && o.precoOriginal && o.precoOriginal > o.precoAtual,
      )
      .sort((a, b) => {
        const descA =
          ((Number(a.precoOriginal!) - Number(a.precoAtual)) /
            Number(a.precoOriginal!)) *
          100;
        const descB =
          ((Number(b.precoOriginal!) - Number(b.precoAtual)) /
            Number(b.precoOriginal!)) *
          100;
        return descB - descA;
      });
  } catch (error) {
    console.error("❌ Erro ao buscar ofertas:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Em Alta</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <TrendingUpIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Em Alta
            </h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {ofertas.length}{" "}
            {ofertas.length === 1
              ? "produto com desconto"
              : "produtos com desconto"}{" "}
            nas melhores lojas
          </p>
        </div>

        {/* Grid de produtos */}
        {ofertas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhum produto em alta no momento
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Volte em breve para ver as novas oportunidades.
            </p>
            <Link
              href="/"
              className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Voltar para Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ofertas.map((oferta) => (
              <ProductCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ÍCONE: Trending Up COM GRADIENTE
// ==========================================
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