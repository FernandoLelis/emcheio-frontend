import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { categoriaService, produtoService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Categoria, Produto, Oferta } from "@/types";

// ==========================================
// TIPAGEM
// ==========================================
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// METADATA (SEO)
// ==========================================
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const categoria = await categoriaService.buscarPorSlug(slug);
    return {
      title: `${categoria.nome} — EmCheio`,
      description: `As melhores ofertas em ${categoria.nome}. Compare preços nas principais lojas.`,
    };
  } catch {
    return {
      title: "Categoria não encontrada — EmCheio",
    };
  }
}

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;

  // Buscar categoria
  let categoria: Categoria;
  try {
    categoria = await categoriaService.buscarPorSlug(slug);
  } catch (error) {
    console.error("❌ Erro ao buscar categoria:", error);
    notFound();
  }

  // Buscar todos os produtos e filtrar por categoria
  let produtos: Produto[] = [];
  try {
    const todos = await produtoService.listar();
    produtos = todos.filter((p) => p.categoriaId === categoria.id);
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
  }

  // Para cada produto, pega a melhor oferta (menor preço) e ADICIONA o produto à oferta
  const produtosComOferta = produtos
    .map((produto) => {
      const melhorOferta = produto.ofertas
        ?.filter((o) => o.disponivel)
        .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];

      if (!melhorOferta) return null;

      // ✅ Enriquece a oferta com o produto (para o ProductCard mostrar nome/imagem)
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
          <Link
            href="/categorias"
            className="hover-gradient-text transition-colors"
          >
            Categorias
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">
            {categoria.nome}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {categoria.nome}
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {produtosComOferta.length}{" "}
            {produtosComOferta.length === 1
              ? "produto disponível"
              : "produtos disponíveis"}{" "}
            nesta categoria
          </p>
        </div>

        {/* Grid de produtos */}
        {produtosComOferta.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhum produto disponível nesta categoria
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Estamos trabalhando para trazer ofertas em breve.
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