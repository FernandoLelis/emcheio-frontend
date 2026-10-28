import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { produtoService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import { StoreLogo } from "@/components/ui/StoreLogo";
import type { Produto, Oferta } from "@/types";

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
    const produto = await produtoService.buscarPorSlug(slug);
    return {
      title: `${produto.nome} — EmCheio`,
      description:
        produto.descricao ||
        `Compare preços de ${produto.nome} nas melhores lojas.`,
    };
  } catch {
    return {
      title: "Produto não encontrado — EmCheio",
    };
  }
}

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;

  // Buscar produto
  let produto: Produto;
  try {
    produto = await produtoService.buscarPorSlug(slug);
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    notFound();
  }

  // Buscar produtos relacionados (mesma categoria, excluindo o atual)
  let relacionados: Produto[] = [];
  if (produto.categoriaId) {
    try {
      const todos = await produtoService.listar();
      relacionados = todos
        .filter(
          (p) =>
            p.categoriaId === produto.categoriaId && p.id !== produto.id,
        )
        .slice(0, 4);
    } catch (error) {
      console.error("❌ Erro ao buscar relacionados:", error);
    }
  }

  // Ordenar ofertas por preço (mais baratas primeiro)
  const ofertasOrdenadas = [...(produto.ofertas || [])]
    .filter((o) => o.disponivel)
    .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual));

  const menorPreco =
    ofertasOrdenadas.length > 0
      ? Number(ofertasOrdenadas[0].precoAtual)
      : null;

  const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const imagemUrl =
    produto.imagemUrl || "https://placehold.co/600x600?text=Sem+Imagem";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link
            href="/"
            className="hover-gradient-text transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          {produto.categoria && (
            <>
              <Link
                href={`/categoria/${produto.categoria.slug}`}
                className="hover-gradient-text transition-colors"
              >
                {produto.categoria.nome}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="line-clamp-1 font-medium text-text-primary">
            {produto.nome}
          </span>
        </nav>

        {/* Grid: Imagem + Info */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Imagem */}
          <div className="flex items-center justify-center rounded-2xl border-2 border-gray-100 bg-gray-50 p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemUrl}
              alt={produto.nome}
              className="h-full max-h-[500px] w-full max-w-[500px] object-contain"
            />
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-4">
            {/* Categoria */}
            {produto.categoria && (
              <span className="w-fit rounded-full bg-brand-magenta/10 px-3 py-1 text-xs font-semibold text-brand-magenta">
                {produto.categoria.nome}
              </span>
            )}

            {/* Nome */}
            <h1 className="text-2xl font-bold leading-tight text-text-primary sm:text-3xl lg:text-4xl">
              {produto.nome}
            </h1>

            {/* Marca */}
            {produto.marca && (
              <p className="text-sm text-text-secondary">
                Marca:{" "}
                <span className="font-semibold text-text-primary">
                  {produto.marca}
                </span>
              </p>
            )}

            {/* Menor preço */}
            {menorPreco !== null && (
              <div className="mt-2">
                <p className="text-xs text-text-secondary">
                  A partir de:
                </p>
                <p className="text-3xl font-extrabold text-success sm:text-4xl">
                  {formatarPreco(menorPreco)}
                </p>
              </div>
            )}

            {/* Descrição */}
            {produto.descricao && (
              <div className="mt-2">
                <h2 className="mb-2 text-sm font-bold text-text-primary">
                  Descrição
                </h2>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {produto.descricao}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ofertas */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl">
            Ofertas disponíveis ({ofertasOrdenadas.length})
          </h2>

          {ofertasOrdenadas.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-text-secondary">
                Nenhuma oferta disponível no momento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ofertasOrdenadas.map((oferta, index) => (
                <OfertaRow
                  key={oferta.id}
                  oferta={oferta}
                  isMelhorPreco={index === 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Produtos Relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-text-primary sm:text-2xl">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relacionados.map((rel) => {
                // Cria uma "oferta fake" para reusar o ProductCard
                const melhorOferta = rel.ofertas
                  ?.filter((o) => o.disponivel)
                  .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];

                if (!melhorOferta) return null;

                return <ProductCard key={rel.id} oferta={melhorOferta} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: Linha de oferta
// ==========================================
function OfertaRow({
  oferta,
  isMelhorPreco,
}: {
  oferta: Oferta;
  isMelhorPreco: boolean;
}) {
  const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const precoAtual = Number(oferta.precoAtual);
  const precoOriginal = oferta.precoOriginal
    ? Number(oferta.precoOriginal)
    : null;

  const desconto =
    precoOriginal && precoOriginal > precoAtual
      ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100)
      : 0;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border-2 p-4 transition-all sm:flex-row sm:items-center sm:gap-6 ${
        isMelhorPreco
          ? "border-success/40 bg-success/5"
          : "border-gray-100 bg-white hover:border-brand-magenta/40 hover:shadow-md"
      }`}
    >
      {/* Loja */}
      <div className="flex min-w-[140px] items-center gap-3">
        <StoreLogo loja={oferta.loja} />
      </div>

      {/* Preços */}
      <div className="flex flex-1 flex-col gap-1">
        {isMelhorPreco && (
          <span className="w-fit rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white">
            Melhor preço
          </span>
        )}
        <div className="flex items-center gap-3">
          {precoOriginal && desconto > 0 && (
            <span className="text-sm font-semibold text-text-secondary line-through">
              {formatarPreco(precoOriginal)}
            </span>
          )}
          <span className="text-xl font-extrabold text-success sm:text-2xl">
            {formatarPreco(precoAtual)}
          </span>
          {desconto > 0 && (
            <span className="rounded-full bg-brand-magenta px-2 py-0.5 text-xs font-bold text-white">
              -{desconto}%
            </span>
          )}
        </div>
      </div>

      {/* Botão */}
      <a
        href={oferta.urlAfiliado}
        target="_blank"
        rel="noopener noreferrer"
        className="gradient-brand flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto"
      >
        Ver Oferta →
      </a>
    </div>
  );
}