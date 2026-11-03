import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Ticket } from "lucide-react"; // ✅ Importamos o ícone de cupom
import { produtoService, cupomService } from "@/lib/services"; // ✅ Importamos o cupomService
import { ProductCard } from "@/components/ui/ProductCard";
import { StoreLogo } from "@/components/ui/StoreLogo";
import type { Produto, Oferta, Cupom } from "@/types"; // ✅ Importamos o tipo Cupom

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const produto = await produtoService.buscarPorSlug(slug);
    return {
      title: `${produto.nome} — EmCheio`,
      description: produto.descricao || `Compare preços de ${produto.nome} nas melhores lojas.`,
    };
  } catch {
    return { title: "Produto não encontrado — EmCheio" };
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;

  let produto: Produto;
  let cuponsValidos: Cupom[] = [];

  // ✅ Busca produto e cupons em paralelo para performance
  try {
    const [produtoData, cuponsData] = await Promise.all([
      produtoService.buscarPorSlug(slug),
      cupomService.listarValidos(),
    ]);
    produto = produtoData;
    cuponsValidos = cuponsData;
  } catch (error) {
    console.error("❌ Erro ao buscar dados do produto:", error);
    notFound();
  }

  // Buscar produtos relacionados
  let relacionados: Produto[] = [];
  if (produto.categoriaId) {
    try {
      const todos = await produtoService.listar();
      relacionados = todos
        .filter((p) => p.categoriaId === produto.categoriaId && p.id !== produto.id)
        .slice(0, 4);
    } catch (error) {
      console.error("❌ Erro ao buscar relacionados:", error);
    }
  }

  // Ordenar ofertas do produto principal por preço
  const ofertasOrdenadas = [...(produto.ofertas || [])]
    .filter((o) => o.disponivel)
    .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual));

  const menorPreco = ofertasOrdenadas.length > 0 ? Number(ofertasOrdenadas[0].precoAtual) : null;

  const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const imagemUrl = produto.imagemUrl || "https://placehold.co/600x600?text=Sem+Imagem";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          {produto.categoria && (
            <>
              <Link href={`/categoria/${produto.categoria.slug}`} className="hover-gradient-text transition-colors">
                {produto.categoria.nome}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="line-clamp-1 font-medium text-text-primary">{produto.nome}</span>
        </nav>

        {/* Grid: Imagem + Info */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Imagem Principal */}
          <div className="flex items-center justify-center rounded-2xl border-2 border-gray-100 bg-white p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemUrl}
              alt={produto.nome}
              className="h-full max-h-[500px] w-full max-w-[500px] object-contain"
            />
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-4">
            {produto.categoria && (
              <span className="w-fit rounded-full bg-brand-magenta/10 px-3 py-1 text-xs font-semibold text-brand-magenta">
                {produto.categoria.nome}
              </span>
            )}

            <h1 className="text-2xl font-bold leading-tight text-text-primary sm:text-3xl lg:text-4xl">
              {produto.nome}
            </h1>

            {produto.marca && (
              <p className="text-sm text-text-secondary">
                Marca: <span className="font-semibold text-text-primary">{produto.marca}</span>
              </p>
            )}

            {menorPreco !== null && (
              <div className="mt-2">
                <p className="text-xs text-text-secondary">A partir de:</p>
                <p className="text-3xl font-extrabold text-success sm:text-4xl">{formatarPreco(menorPreco)}</p>
              </div>
            )}

            {produto.descricao && (
              <div className="mt-2">
                <h2 className="mb-2 text-sm font-bold text-text-primary">Descrição</h2>
                <p className="text-sm leading-relaxed text-text-secondary">{produto.descricao}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ofertas do Produto */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl">
            Ofertas disponíveis ({ofertasOrdenadas.length})
          </h2>

          {ofertasOrdenadas.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-text-secondary">Nenhuma oferta disponível no momento.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ofertasOrdenadas.map((oferta, index) => (
                <OfertaRow 
                  key={oferta.id} 
                  oferta={oferta} 
                  isMelhorPreco={index === 0} 
                  cupons={cuponsValidos} // ✅ Passando os cupons para o componente
                />
              ))}
            </div>
          )}
        </div>

        {/* Produtos Relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-text-primary sm:text-2xl">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relacionados.map((rel) => {
                const melhorOferta = rel.ofertas
                  ?.filter((o) => o.disponivel)
                  .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];

                if (!melhorOferta) return null;

                const ofertaComProduto: Oferta = {
                  ...melhorOferta,
                  produto: rel,
                };

                return <ProductCard key={rel.id} oferta={ofertaComProduto} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Componente OfertaRow atualizado para receber os cupons
function OfertaRow({ oferta, isMelhorPreco, cupons }: { oferta: Oferta; isMelhorPreco: boolean; cupons: Cupom[] }) {
  const formatarPreco = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const precoAtual = Number(oferta.precoAtual);
  const precoOriginal = oferta.precoOriginal ? Number(oferta.precoOriginal) : null;
  const desconto = precoOriginal && precoOriginal > precoAtual ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100) : 0;

  // ✅ Encontra o cupom da loja (usando toLowerCase para evitar erros de digitação)
  const cupomDaLoja = cupons.find(c => c.loja.toLowerCase() === oferta.loja.toLowerCase());

  return (
    <div className={`flex flex-col gap-4 rounded-2xl border-2 p-4 transition-all sm:flex-row sm:items-center sm:gap-6 ${isMelhorPreco ? "border-success/40 bg-success/5" : "border-gray-100 bg-white hover:border-brand-magenta/40 hover:shadow-md"}`}>
      <div className="flex min-w-[140px] items-center gap-3">
        <StoreLogo loja={oferta.loja} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {isMelhorPreco && (
          <span className="w-fit rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white">Melhor preço</span>
        )}
        <div className="flex items-center gap-3">
          {precoOriginal && desconto > 0 && (
            <span className="text-sm font-semibold text-text-secondary line-through">{formatarPreco(precoOriginal)}</span>
          )}
          <span className="text-xl font-extrabold text-success sm:text-2xl">{formatarPreco(precoAtual)}</span>
          {desconto > 0 && (
            <span className="rounded-full bg-brand-magenta px-2 py-0.5 text-xs font-bold text-white">-{desconto}%</span>
          )}
        </div>

        {/* ✅ VISUAL DO CUPOM EMBUTIDO */}
        {cupomDaLoja && (
          <div className="mt-1 flex w-fit items-center gap-2 rounded-lg border border-dashed border-brand-orange bg-orange-50 px-3 py-1.5 text-xs text-brand-orange">
            <Ticket className="h-4 w-4" />
            <span>Use o cupom:</span>
            <span className="font-mono text-sm font-bold uppercase tracking-wider">{cupomDaLoja.codigo}</span>
            {cupomDaLoja.descontoTexto && (
              <span className="hidden sm:inline border-l border-orange-200 pl-2 font-semibold">
                {cupomDaLoja.descontoTexto}
              </span>
            )}
          </div>
        )}
      </div>
      <a href={oferta.urlAfiliado} target="_blank" rel="noopener noreferrer" className="gradient-brand flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto">
        Ver Oferta →
      </a>
    </div>
  );
}