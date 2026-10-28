import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { produtoService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Produto, Oferta } from "@/types";

// ==========================================
// TIPAGEM
// ==========================================
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// ==========================================
// METADATA (SEO)
// ==========================================
export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Busca por "${q}" — EmCheio` : "Busca — EmCheio",
    description: `Resultados de busca para "${q}" nas melhores lojas.`,
  };
}

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const termo = q?.trim() || "";

  let produtos: Produto[] = [];

  if (termo) {
    try {
      produtos = await produtoService.buscar(termo);
    } catch (error) {
      console.error("❌ Erro ao buscar produtos:", error);
    }
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
          <span className="font-medium text-text-primary">Busca</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-brand-magenta sm:h-9 sm:w-9" />
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
              {termo ? `Resultados para "${termo}"` : "Buscar Produtos"}
            </h1>
          </div>
          
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {termo ? (
              `${produtosComOferta.length} ${
                produtosComOferta.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"
              }`
            ) : (
              "Digite algo na barra de busca acima para começar."
            )}
          </p>
        </div>

        {/* Resultados */}
        {termo && produtosComOferta.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhum resultado encontrado para "{termo}"
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Tente buscar por outro nome, marca ou categoria.
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