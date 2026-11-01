import { Hero } from "@/components/home/Hero";
import { OfertasDoDia } from "@/components/home/OfertasDoDia";
import { CuponsAtivos } from "@/components/home/CuponsAtivos";
import { EmAlta } from "@/components/home/EmAlta";
import { Novidades } from "@/components/home/Novidades";
import { Categorias } from "@/components/home/Categorias";
import { Newsletter } from "@/components/home/Newsletter";
import { ofertaService, produtoService } from "@/lib/services";
import type { Oferta, Produto } from "@/types";

// ✅ Força a página a buscar dados novos sempre que for acessada
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Buscar ofertas (para Ofertas do Dia + Em Alta)
  let todasOfertas: Oferta[] = [];
  try {
    todasOfertas = await ofertaService.listar();
  } catch (error) {
    console.error("❌ Erro ao buscar ofertas:", error);
  }

  // Buscar produtos (para Novidades)
  let todosProdutos: Produto[] = [];
  try {
    todosProdutos = await produtoService.listar();
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
  }

  // Ofertas do Dia: em destaque, primeiras 6
  const ofertasDoDia = todasOfertas.filter((o) => o.destaque).slice(0, 6);

  // Em Alta: ordenar por maior desconto, primeiras 4
  const ofertasEmAlta = [...todasOfertas]
    .filter((o) => o.precoOriginal && o.precoOriginal > o.precoAtual)
    .sort((a, b) => {
      const descontoA = ((a.precoOriginal! - a.precoAtual) / a.precoOriginal!) * 100;
      const descontoB = ((b.precoOriginal! - b.precoAtual) / b.precoOriginal!) * 100;
      return descontoB - descontoA;
    })
    .slice(0, 4);

  // Novidades: produtos mais recentes, primeiros 4
  const produtosNovidades = [...todosProdutos]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 4);

  return (
    <>
      <Hero />
      <OfertasDoDia ofertas={ofertasDoDia} />
      <CuponsAtivos />
      <EmAlta ofertas={ofertasEmAlta} />
      <Novidades produtos={produtosNovidades} />
      <Categorias />
      <Newsletter />
    </>
  );
}