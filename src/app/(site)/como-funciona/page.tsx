import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Como funciona — EmCheio",
  description: "Saiba como o EmCheio encontra as melhores ofertas para você.",
};

export default function ComoFuncionaPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Como funciona</span>
        </nav>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
            Como funciona o <span className="gradient-brand-text">EmCheio</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Nossa missão é ajudar você a economizar tempo e dinheiro.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          <div className="flex gap-4">
            <span className="gradient-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm">
              1
            </span>
            <div>
              <h2 className="mb-2 text-xl font-bold text-text-primary">
                Buscamos as ofertas
              </h2>
              <p className="text-base leading-relaxed text-text-secondary">
                Monitoramos os principais marketplaces do Brasil — Amazon,
                Mercado Livre, Shopee, Magalu e mais — para encontrar as melhores
                promoções do dia.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="gradient-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm">
              2
            </span>
            <div>
              <h2 className="mb-2 text-xl font-bold text-text-primary">
                Comparamos os preços
              </h2>
              <p className="text-base leading-relaxed text-text-secondary">
                Quando possível, mostramos o preço do mesmo produto em várias
                lojas, para você escolher onde comprar. Nossa busca por produto
                facilita essa visualização.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="gradient-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm">
              3
            </span>
            <div>
              <h2 className="mb-2 text-xl font-bold text-text-primary">
                Você economiza
              </h2>
              <p className="text-base leading-relaxed text-text-secondary">
                Clica no link, vai direto para a loja e finaliza a compra com o
                melhor preço. Sem intermediários, sem complicação.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border-2 border-gray-100 bg-gray-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Pronto para começar?
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Explore as ofertas do dia e encontre o que você procura.
          </p>
          <Link
            href="/ofertas"
            className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Ver Ofertas →
          </Link>
        </div>
      </div>
    </div>
  );
}