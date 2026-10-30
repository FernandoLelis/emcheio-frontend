import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — EmCheio",
  description: "Termos e condições de uso do site EmCheio.",
};

export default function TermosPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Termos de Uso</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold text-text-primary sm:text-4xl">
          Termos de Uso
        </h1>

        <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">1. Aceitação dos Termos</h2>
            <p className="leading-relaxed">
              Ao acessar e usar o site EmCheio, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Se você não concorda com qualquer parte destes termos, não utilize o site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">2. Descrição do Serviço</h2>
            <p className="leading-relaxed">
              O EmCheio é um guia de compras que reúne ofertas de produtos de terceiros (marketplaces como Amazon, Mercado Livre, Shopee, etc.). Não vendemos produtos diretamente. Ao clicar em uma oferta, você é redirecionado para a loja parceira, onde a compra é realizada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">3. Preços e Disponibilidade</h2>
            <p className="leading-relaxed">
              Os preços e a disponibilidade dos produtos são de responsabilidade das lojas parceiras. Fazemos o possível para manter as informações atualizadas, mas recomendamos sempre verificar o preço final diretamente no site da loja antes de concluir a compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">4. Programa de Afiliados</h2>
            <p className="leading-relaxed">
              O EmCheio participa de programas de afiliados. Isso significa que podemos receber uma comissão quando você realiza uma compra através dos nossos links, sem qualquer custo adicional para você. Essa é a forma como mantemos o site gratuito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">5. Uso do Site</h2>
            <p className="leading-relaxed">
              Você concorda em não usar o site para fins ilegais ou não autorizados. É proibido tentar acessar áreas restritas (painel administrativo) sem autorização, ou interferir no funcionamento do site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}