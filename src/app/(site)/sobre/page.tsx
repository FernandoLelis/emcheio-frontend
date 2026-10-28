import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ==========================================
// METADATA (SEO)
// ==========================================
export const metadata = {
  title: "Sobre — EmCheio",
  description:
    "Conheça o EmCheio, o guia de compras que reúne as melhores ofertas da internet em um só lugar.",
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function SobrePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Sobre</span>
        </nav>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
            Sobre o <span className="gradient-brand-text">EmCheio</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            O guia de compras que ajuda você a economizar tempo e dinheiro.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="prose prose-lg max-w-none">
          {/* Seção 1: O que é */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl">
              O que é o EmCheio?
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              O EmCheio é um guia de compras que reúne as melhores ofertas da
              internet em um só lugar. Nosso objetivo é simples:{" "}
              <strong className="text-text-primary">
                ajudar você a encontrar o melhor preço em menos tempo
              </strong>
              . Em vez de visitar vários sites, você encontra tudo no EmCheio.
            </p>
          </section>

          {/* Seção 2: Como funciona */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl">
              Como funciona?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="gradient-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                  1
                </span>
                <div>
                  <h3 className="mb-1 font-bold text-text-primary">
                    Buscamos as ofertas
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Monitoramos os principais marketplaces do Brasil — Amazon,
                    Mercado Livre, Shopee, Magalu e mais — para encontrar as
                    melhores promoções.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="gradient-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                  2
                </span>
                <div>
                  <h3 className="mb-1 font-bold text-text-primary">
                    Comparamos os preços
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Quando possível, mostramos o preço do mesmo produto em
                    várias lojas, para você escolher onde comprar.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="gradient-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                  3
                </span>
                <div>
                  <h3 className="mb-1 font-bold text-text-primary">
                    Você economiza
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Clica no link, vai direto para a loja e finaliza a compra
                    com o melhor preço. Sem intermediários, sem complicação.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 3: Aviso de Afiliado */}
          <section className="mb-12 rounded-2xl border-2 border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl">
              Aviso de Afiliado
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              O EmCheio participa de{" "}
              <strong className="text-text-primary">
                programas de afiliados
              </strong>{" "}
              das principais lojas do Brasil (Amazon, Mercado Livre, Shopee,
              Magalu, entre outras).
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Isso significa que, ao clicar em nossos links e realizar uma
              compra, podemos receber uma comissão da loja.{" "}
              <strong className="text-text-primary">
                Importante: o preço pago por você é exatamente o mesmo
              </strong>{" "}
              — a comissão é paga pela loja, não pelo cliente.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              Essa é a forma que encontramos de manter o EmCheio gratuito e
              continuar trazendo as melhores ofertas para você.
            </p>
          </section>

          {/* Seção 4: Compromisso */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl">
              Nosso Compromisso
            </h2>
            <ul className="space-y-3 text-base text-text-secondary">
              <li className="flex gap-3">
                <span className="text-brand-magenta">✓</span>
                <span>
                  <strong className="text-text-primary">Transparência:</strong>{" "}
                  sempre deixamos claro quando um link é de afiliado.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-magenta">✓</span>
                <span>
                  <strong className="text-text-primary">
                    Preços atualizados:
                  </strong>{" "}
                  trabalhamos para manter os preços sempre precisos, mas
                  recomendamos conferir direto na loja antes de comprar.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-magenta">✓</span>
                <span>
                  <strong className="text-text-primary">Sem spam:</strong> não
                  vendemos seus dados e só enviamos e-mails se você se inscrever
                  na newsletter.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-magenta">✓</span>
                <span>
                  <strong className="text-text-primary">Gratuito:</strong> o
                  EmCheio é e sempre será gratuito para o usuário.
                </span>
              </li>
            </ul>
          </section>

          {/* Seção 5: Contato */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl">
              Fale Conosco
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              Tem alguma dúvida, sugestão ou encontrou algum preço errado? Adoraríamos
              ouvir você.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              📧 E-mail:{" "}
              <a
                href="mailto:contato@emcheio.com.br"
                className="gradient-brand-text hover-magenta-text font-semibold"
              >
                contato@emcheio.com.br
              </a>
            </p>
          </section>
        </div>

        {/* CTA Final */}
        <div className="mt-16 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-brand-magenta/5 to-brand-orange/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Pronto para economizar?
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Explore as melhores ofertas do momento agora mesmo.
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