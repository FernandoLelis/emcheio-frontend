import { Hero } from "@/components/home/Hero";
import { OfertasDoDia } from "@/components/home/OfertasDoDia";
import { CuponsAtivos } from "@/components/home/CuponsAtivos";
import { EmAlta } from "@/components/home/EmAlta";
import { Novidades } from "@/components/home/Novidades";
import { Categorias } from "@/components/home/Categorias";
import { Newsletter } from "@/components/home/Newsletter";
import { ofertaService, produtoService } from "@/lib/services";
import type { Oferta, Produto } from "@/types";

export default async function HomePage() {
  let todasOfertas: Oferta[] = [];
  let todosProdutos: Produto[] = [];
  let totalOfertasAtivas = 0;

  try {
    // ✅ Busca a contagem exata para o Hero
    const contagem = await ofertaService.getContagem();
    totalOfertasAtivas = contagem.total;

    // Busca os dados completos para as seções
    todasOfertas = await ofertaService.listar();
    todosProdutos = await produtoService.listar();
  } catch (error) {
    console.error("❌ Erro ao buscar dados na Home:", error);
  }

  const ofertasDoDia = todasOfertas.filter((o) => o.destaque).slice(0, 6);

  const ofertasEmAlta = [...todasOfertas]
    .filter((o) => o.precoOriginal && o.precoOriginal > o.precoAtual)
    .sort((a, b) => {
      const descontoA = ((a.precoOriginal! - a.precoAtual) / a.precoOriginal!) * 100;
      const descontoB = ((b.precoOriginal! - b.precoAtual) / b.precoOriginal!) * 100;
      return descontoB - descontoA;
    })
    .slice(0, 4);

  const produtosNovidades = [...todosProdutos]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 4);

  return (
    <>
      {/* ✅ Passando o total de ofertas para o Hero */}
      <Hero totalOfertas={totalOfertasAtivas} />
      <OfertasDoDia ofertas={ofertasDoDia} />
      <CuponsAtivos />
      <EmAlta ofertas={ofertasEmAlta} />
      <Novidades produtos={produtosNovidades} />
      <Categorias />
      <Newsletter />
    </>
  );
}