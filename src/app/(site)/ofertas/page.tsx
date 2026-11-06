import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ofertaService, categoriaService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import { FiltrosListagem } from "@/components/ui/FiltrosListagem";
import type { Oferta, Categoria } from "@/types";

export const metadata = {
  title: "Ofertas — EmCheio",
  description: "Todas as ofertas disponíveis nas melhores lojas. Compare preços e economize.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OfertasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filtroLoja = typeof params.loja === "string" ? params.loja : "";
  const filtroCategoria = typeof params.categoria === "string" ? params.categoria : "";
  const ordem = typeof params.ordem === "string" ? params.ordem : "maior-desconto";

  let ofertas: Oferta[] = [];
  let categorias: Categoria[] = [];

  try {
    const [todasOfertas, todasCategorias] = await Promise.all([
      ofertaService.listar(),
      categoriaService.listar(),
    ]);
    ofertas = todasOfertas.filter((o) => o.disponivel);
    categorias = todasCategorias.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error("❌ Erro ao buscar dados:", error);
  }

  const lojasDisponiveis = Array.from(new Set(ofertas.map((o) => o.loja))).sort();

  let ofertasFiltradas = ofertas;

  // Aplicar Filtro de Loja
  if (filtroLoja) {
    ofertasFiltradas = ofertasFiltradas.filter((o) => o.loja === filtroLoja);
  }

  // Aplicar Filtro de Categoria (✅ Usando categoriaId para funcionar)
  if (filtroCategoria) {
    const categoriaSelecionada = categorias.find(c => c.slug === filtroCategoria);
    if (categoriaSelecionada) {
      ofertasFiltradas = ofertasFiltradas.filter((o) => o.produto?.categoriaId === categoriaSelecionada.id);
    }
  }

  // Aplicar Ordenação
  ofertasFiltradas = [...ofertasFiltradas].sort((a, b) => {
    if (ordem === "maior-desconto") {
      const descA = a.precoOriginal ? ((Number(a.precoOriginal) - Number(a.precoAtual)) / Number(a.precoOriginal)) * 100 : 0;
      const descB = b.precoOriginal ? ((Number(b.precoOriginal) - Number(b.precoAtual)) / Number(b.precoOriginal)) * 100 : 0;
      return descB - descA;
    }
    if (ordem === "menor-desconto") {
      const descA = a.precoOriginal ? ((Number(a.precoOriginal) - Number(a.precoAtual)) / Number(a.precoOriginal)) * 100 : 0;
      const descB = b.precoOriginal ? ((Number(b.precoOriginal) - Number(b.precoAtual)) / Number(b.precoOriginal)) * 100 : 0;
      return descA - descB;
    }
    if (ordem === "menor-preco") return Number(a.precoAtual) - Number(b.precoAtual);
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Ofertas</span>
        </nav>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <img src="https://img.icons8.com/emoji/48/fire.png" alt="" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Ofertas</h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {ofertasFiltradas.length} {ofertasFiltradas.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
          </p>
        </div>

        <FiltrosListagem
          lojasDisponiveis={lojasDisponiveis}
          categoriasDisponiveis={categorias}
          mostrarFiltroCategoria={true}
          opcoesOrdenacao={[
            { value: "maior-desconto", label: "Maior Desconto" },
            { value: "menor-desconto", label: "Menor Desconto" },
            { value: "menor-preco", label: "Menor Preço" },
            { value: "novos", label: "Mais Recentes" },
          ]}
        />

        {ofertasFiltradas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">Nenhuma oferta encontrada com esses filtros</p>
            <Link href="/" className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]">Voltar para Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ofertasFiltradas.map((oferta) => (
              <ProductCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}