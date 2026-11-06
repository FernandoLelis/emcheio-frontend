import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { categoriaService, produtoService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import { FiltrosListagem } from "@/components/ui/FiltrosListagem";
import type { Categoria, Produto, Oferta } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const categoria = await categoriaService.buscarPorSlug(slug);
    return {
      title: `${categoria.nome} — EmCheio`,
      description: `As melhores ofertas em ${categoria.nome}. Compare preços nas principais lojas.`,
    };
  } catch {
    return { title: "Categoria não encontrada — EmCheio" };
  }
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const filtroLoja = typeof search.loja === "string" ? search.loja : "";
  const ordem = typeof search.ordem === "string" ? search.ordem : "maior-desconto";

  let categoria: Categoria;
  try {
    categoria = await categoriaService.buscarPorSlug(slug);
  } catch (error) {
    console.error("❌ Erro ao buscar categoria:", error);
    notFound();
  }

  let produtosComOferta: { produto: Produto; oferta: Oferta }[] = [];

  try {
    const todos = await produtoService.listar();
    const produtos = todos.filter((p) => p.categoriaId === categoria.id);

    produtosComOferta = produtos
      .map((produto) => {
        const melhorOferta = produto.ofertas
          ?.filter((o) => o.disponivel)
          .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];

        if (!melhorOferta) return null;
        return { produto, oferta: { ...melhorOferta, produto } as Oferta };
      })
      .filter((item): item is { produto: Produto; oferta: Oferta } => !!item);
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
  }

  const lojasDisponiveis = Array.from(new Set(produtosComOferta.map((p) => p.oferta.loja))).sort();

  let filtrados = produtosComOferta;

  if (filtroLoja) {
    filtrados = filtrados.filter((p) => p.oferta.loja === filtroLoja);
  }

  filtrados = [...filtrados].sort((a, b) => {
    if (ordem === "maior-desconto") {
      const descA = a.oferta.precoOriginal ? ((Number(a.oferta.precoOriginal) - Number(a.oferta.precoAtual)) / Number(a.oferta.precoOriginal)) * 100 : 0;
      const descB = b.oferta.precoOriginal ? ((Number(b.oferta.precoOriginal) - Number(b.oferta.precoAtual)) / Number(b.oferta.precoOriginal)) * 100 : 0;
      return descB - descA;
    }
    if (ordem === "menor-preco") return Number(a.oferta.precoAtual) - Number(b.oferta.precoAtual);
    return new Date(b.produto.criadoEm).getTime() - new Date(a.produto.criadoEm).getTime();
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/categorias" className="hover-gradient-text transition-colors">Categorias</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">{categoria.nome}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{categoria.nome}</h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {filtrados.length} {filtrados.length === 1 ? "produto disponível" : "produtos disponíveis"} nesta categoria
          </p>
        </div>

        <FiltrosListagem
          lojasDisponiveis={lojasDisponiveis}
          mostrarFiltroCategoria={false} // ✅ Não mostra filtro de categoria
          opcoesOrdenacao={[
            { value: "maior-desconto", label: "Maior Desconto" },
            { value: "menor-desconto", label: "Menor Desconto" },
            { value: "menor-preco", label: "Menor Preço" },
            { value: "novos", label: "Mais Recentes" },
          ]}
        />

        {filtrados.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">Nenhum produto encontrado com esses filtros</p>
            <Link href="/" className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]">Voltar para Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtrados.map(({ oferta }) => (
              <ProductCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}