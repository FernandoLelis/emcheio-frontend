import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { produtoService, categoriaService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import { FiltrosListagem } from "@/components/ui/FiltrosListagem";
import type { Produto, Oferta, Categoria } from "@/types";

export const metadata = {
  title: "Novidades — EmCheio",
  description: "Os produtos mais recentes com desconto.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NovidadesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filtroLoja = typeof params.loja === "string" ? params.loja : "";
  const filtroCategoria = typeof params.categoria === "string" ? params.categoria : "";
  const ordem = typeof params.ordem === "string" ? params.ordem : "novos";

  let produtosComOferta: { produto: Produto; oferta: Oferta }[] = [];
  let categorias: Categoria[] = [];

  try {
    const [todosProdutos, todasCategorias] = await Promise.all([
      produtoService.listar(),
      categoriaService.listar(),
    ]);
    categorias = todasCategorias.sort((a, b) => a.nome.localeCompare(b.nome));

    const produtos = [...todosProdutos].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

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
    console.error("❌ Erro ao buscar dados:", error);
  }

  const lojasDisponiveis = Array.from(new Set(produtosComOferta.map((p) => p.oferta.loja))).sort();

  let filtrados = produtosComOferta;
  
  if (filtroLoja) filtrados = filtrados.filter((p) => p.oferta.loja === filtroLoja);
  if (filtroCategoria) filtrados = filtrados.filter((p) => p.produto.categoria?.slug === filtroCategoria);

  filtrados = [...filtrados].sort((a, b) => {
    if (ordem === "maior-desconto") {
      const descA = a.oferta.precoOriginal ? ((Number(a.oferta.precoOriginal) - Number(a.oferta.precoAtual)) / Number(a.oferta.precoOriginal)) * 100 : 0;
      const descB = b.oferta.precoOriginal ? ((Number(b.oferta.precoOriginal) - Number(b.oferta.precoAtual)) / Number(b.oferta.precoOriginal)) * 100 : 0;
      return descB - descA;
    }
    if (ordem === "menor-preco") return Number(a.oferta.precoAtual) - Number(b.oferta.precoAtual);
    return new Date(b.produto.criadoEm).getTime() - new Date(a.produto.criadoEm).getTime(); // default novos
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Novidades</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <NewIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Novidades</h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {filtrados.length} {filtrados.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        <FiltrosListagem
          lojasDisponiveis={lojasDisponiveis}
          categoriasDisponiveis={categorias}
          mostrarFiltroCategoria={true}
          opcoesOrdenacao={[
            { value: "novos", label: "Mais Recentes" },
            { value: "maior-desconto", label: "Maior Desconto" },
            { value: "menor-preco", label: "Menor Preço" },
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

function NewIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <defs>
        <linearGradient id="new-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF0080" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" stroke="url(#new-gradient)" />
      <path d="M20 3v4" stroke="url(#new-gradient)" />
      <path d="M22 5h-4" stroke="url(#new-gradient)" />
      <path d="M4 17v2" stroke="url(#new-gradient)" />
      <path d="M5 18H3" stroke="url(#new-gradient)" />
    </svg>
  );
}