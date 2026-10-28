import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { produtoService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Produto, Oferta } from "@/types";

// ==========================================
// METADATA (SEO)
// ==========================================
export const metadata = {
  title: "Novidades — EmCheio",
  description:
    "Os produtos mais recentes. Acabaram de chegar e já estão com desconto.",
};

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function NovidadesPage() {
  let produtos: Produto[] = [];

  try {
    const todos = await produtoService.listar();
    // Ordena por criadoEm (mais recentes primeiro)
    produtos = [...todos].sort(
      (a, b) =>
        new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
    );
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
  }

  // Enriquece cada produto com sua melhor oferta para o ProductCard
  const produtosComOferta = produtos
    .map((produto) => {
      const melhorOferta = produto.ofertas
        ?.filter((o) => o.disponivel)
        .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];

      if (!melhorOferta) return null;

      const ofertaComProduto: Oferta = {
        ...melhorOferta,
        produto,
      };

      return { produto, oferta: ofertaComProduto };
    })
    .filter((item): item is { produto: Produto; oferta: Oferta } => !!item);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Novidades</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <NewIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Novidades
            </h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {produtosComOferta.length}{" "}
            {produtosComOferta.length === 1
              ? "produto recém-chegado"
              : "produtos recém-chegados"}{" "}
            com ofertas disponíveis
          </p>
        </div>

        {/* Grid de produtos */}
        {produtosComOferta.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhuma novidade no momento
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Volte em breve para ver os novos produtos.
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
            {produtosComOferta.map(({ oferta }) => (
              <ProductCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ÍCONE: New (Sparkles) COM GRADIENTE
// ==========================================
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