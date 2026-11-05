import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Ticket, ChevronDown } from "lucide-react";
import { produtoService, cupomService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import { StoreLogo } from "@/components/ui/StoreLogo";
import { BotaoCopiarCupom } from "@/components/ui/BotaoCopiarCupom";
import { BotaoCompartilhar } from "@/components/ui/BotaoCompartilhar";
import type { Produto, Oferta, Cupom } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const produto = await produtoService.buscarPorSlug(slug);
    
    const menorOferta = produto.ofertas
      ?.filter(o => o.disponivel)
      .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];
      
    const precoFormatado = menorOferta 
      ? Number(menorOferta.precoAtual).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "";

    return {
      title: `${produto.nome} — EmCheio`,
      description: `Compre ${produto.nome} por ${precoFormatado} no EmCheio! Compare preços e economize.`,
      openGraph: {
        title: `${produto.nome} por ${precoFormatado}`,
        description: produto.descricao || `Compare preços de ${produto.nome} nas melhores lojas.`,
        images: produto.imagemUrl ? [{ url: produto.imagemUrl }] : [],
      },
    };
  } catch {
    return { title: "Produto não encontrado — EmCheio" };
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;

  let produto: Produto;
  let cuponsValidos: Cupom[] = [];

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

  const ofertasOrdenadas = [...(produto.ofertas || [])]
    .filter((o) => o.disponivel)
    .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual));

  const melhorOferta = ofertasOrdenadas[0];
  const menorPreco = melhorOferta ? Number(melhorOferta.precoAtual) : null;
  const precoOriginal = melhorOferta?.precoOriginal ? Number(melhorOferta.precoOriginal) : null;
  const desconto = precoOriginal && precoOriginal > (menorPreco || 0) 
    ? Math.round(((precoOriginal - (menorPreco || 0)) / precoOriginal) * 100) 
    : 0;

  const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const imagemUrl = produto.imagemUrl || "https://placehold.co/600x600?text=Sem+Imagem";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex items-center justify-center rounded-2xl border-2 border-gray-100 bg-white p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemUrl}
              alt={produto.nome}
              className="h-full max-h-[500px] w-full max-w-[500px] object-contain"
            />
          </div>

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

            {/* ✅ BLOCO DE PREÇOS ATUALIZADO */}
            {menorPreco !== null && (
              <div className="mt-2 flex flex-col gap-4 border-t border-gray-100 pt-4">
                <div className="flex flex-col items-start gap-2">
                  {/* Pílula verde do Melhor Oferta */}
                  <span className="rounded-full bg-success px-3 py-1 text-xs font-bold text-white">
                    Melhor Oferta
                  </span>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {precoOriginal && precoOriginal > menorPreco && (
                      <span className="text-lg font-semibold text-text-secondary line-through">
                        {formatarPreco(precoOriginal)}
                      </span>
                    )}
                    <span className="text-3xl font-extrabold text-success sm:text-4xl">
                      {formatarPreco(menorPreco)}
                    </span>
                    {desconto > 0 && (
                      <span className="rounded-full bg-brand-magenta px-2.5 py-1 text-sm font-bold text-white">
                        -{desconto}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a 
                    href="#ofertas" 
                    className="gradient-brand flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                  >
                    Ver Ofertas
                    <ChevronDown className="h-4 w-4" />
                  </a>
                  
                  <BotaoCompartilhar 
                    titulo={produto.nome} 
                    preco={formatarPreco(menorPreco)} 
                  />
                </div>
              </div>
            )}

            {produto.descricao && (
              <div className="mt-4">
                <h2 className="mb-2 text-sm font-bold text-text-primary">Descrição</h2>
                <p className="text-sm leading-relaxed text-text-secondary">{produto.descricao}</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ ADICIONADO O ID="OFERTAS" E SCROLL-MT PARA A ÂNCORA FUNCIONAR */}
        <div id="ofertas" className="mt-12 scroll-mt-24">
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
                  cupons={cuponsValidos}
                  categoriaId={produto.categoriaId}
                />
              ))}
            </div>
          )}
        </div>

        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-text-primary sm:text-2xl">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relacionados.map((rel) => {
                const melhorOfertaRel = rel.ofertas
                  ?.filter((o) => o.disponivel)
                  .sort((a, b) => Number(a.precoAtual) - Number(b.precoAtual))[0];

                if (!melhorOfertaRel) return null;

                const ofertaComProduto: Oferta = {
                  ...melhorOfertaRel,
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

function OfertaRow({ 
  oferta, 
  isMelhorPreco, 
  cupons, 
  categoriaId 
}: { 
  oferta: Oferta; 
  isMelhorPreco: boolean; 
  cupons: Cupom[]; 
  categoriaId?: number | null 
}) {
  const formatarPreco = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const precoAtual = Number(oferta.precoAtual);
  const precoOriginal = oferta.precoOriginal ? Number(oferta.precoOriginal) : null;
  const desconto = precoOriginal && precoOriginal > precoAtual ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100) : 0;

  const cuponsDaLoja = cupons.filter(c => {
    if (c.loja.toLowerCase() !== oferta.loja.toLowerCase()) return false;
    if (c.aplicarEmTodoSite) return true;
    
    if (c.categorias && c.categorias.length > 0) {
      return c.categorias.some(cat => cat.id === categoriaId);
    }
    
    return false;
  });

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

        {cuponsDaLoja.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              {cuponsDaLoja.length > 1 
                ? "Cupons disponíveis para este produto" 
                : "Cupom disponível para este produto"}
            </span>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cuponsDaLoja.map((cupom) => (
                <div key={cupom.id} className="flex flex-col justify-between gap-1.5 rounded-lg border border-dashed border-brand-orange bg-orange-50/50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Ticket className="h-3 w-3 shrink-0 text-brand-orange" />
                      <span className="truncate font-mono text-sm font-bold uppercase tracking-wider text-brand-orange">
                        {cupom.codigo}
                      </span>
                    </div>
                    <BotaoCopiarCupom codigo={cupom.codigo} />
                  </div>
                  
                  <div className="mt-1 flex items-center justify-between gap-2 border-t border-orange-200/50 pt-1.5">
                    {cupom.descontoTexto && (
                      <span className="text-sm font-bold text-brand-orange truncate">
                        {cupom.descontoTexto}
                      </span>
                    )}
                  </div>

                  {cupom.condicoes && (
                    <p className="line-clamp-2 text-[10px] leading-tight text-orange-600/80">
                      * {cupom.condicoes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <a href={oferta.urlAfiliado} target="_blank" rel="noopener noreferrer" className="gradient-brand flex shrink-0 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto">
        Ver Oferta →
      </a>
    </div>
  );
}