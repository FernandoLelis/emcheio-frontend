import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Sobre — EmCheio",
  description: "Conheça a história e a missão do EmCheio, o guia de compras que ajuda você a economizar.",
};

export default function SobrePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Sobre</span>
        </nav>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
            Sobre o <span className="gradient-brand-text">EmCheio</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            O guia de compras que ajuda você a economizar tempo e dinheiro.
          </p>
        </div>

        <div className="space-y-6 text-base leading-relaxed text-text-secondary">
          <p>
            O EmCheio nasceu de uma necessidade simples: encontrar as melhores ofertas na internet não deveria ser uma tarefa difícil. Com tantas lojas, promoções e cupons espalhados por aí, o consumidor acaba perdendo tempo (e dinheiro) tentando achar o melhor preço.
          </p>
          <p>
            Nossa missão é ser o seu guia de compras definitivo. Reunimos as melhores ofertas da Amazon, Mercado Livre, Shopee, Magalu e outras grandes lojas em um só lugar. Você não precisa mais abrir dezenas de abas no navegador para comparar preços.
          </p>
          <p>
            Além disso, temos um compromisso com a transparência. Deixamos claro quando um link é de afiliado e como o site se mantém gratuito para você.
          </p>
          <div className="mt-8 rounded-2xl border-2 border-gray-100 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-text-primary mb-2">Nossos Valores</h2>
            <ul className="space-y-2">
              <li><strong>Transparência:</strong> Sempre deixamos claro como ganhamos dinheiro.</li>
              <li><strong>Economia:</strong> Nosso foco é ajudar você a pagar menos.</li>
              <li><strong>Confiança:</strong> Só indicamos lojas e produtos confiáveis.</li>
              <li><strong>Gratuidade:</strong> O EmCheio é e sempre será gratuito.</li>
            </ul>
          </div>
          <p className="mt-4">
            Quer entender melhor como funciona? Visite nossa página <Link href="/como-funciona" className="text-brand-magenta font-semibold hover:underline">Como Funciona</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}