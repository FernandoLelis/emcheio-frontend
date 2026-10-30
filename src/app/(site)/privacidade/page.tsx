import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — EmCheio",
  description: "Saiba como o EmCheio trata seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Política de Privacidade</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold text-text-primary sm:text-4xl">
          Política de Privacidade
        </h1>

        <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">1. Dados Coletados</h2>
            <p className="leading-relaxed">
              Coletamos apenas as informações necessárias para fornecer nossos serviços:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Inscrição na Newsletter:</strong> Nome, e-mail e WhatsApp (opcional), fornecidos voluntariamente por você.</li>
              <li><strong>Navegação:</strong> Não utilizamos cookies de rastreamento para terceiros. Utilizamos apenas cookies essenciais para o funcionamento do site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">2. Uso dos Dados</h2>
            <p className="leading-relaxed">
              Os dados coletados são usados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Enviar ofertas exclusivas e cupons (caso você tenha se inscrito).</li>
              <li>Melhorar a experiência de navegação no site.</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">3. Compartilhamento de Dados</h2>
            <p className="leading-relaxed">
              O EmCheio <strong>não vende</strong> ou compartilha seus dados com terceiros para fins de marketing. Seus dados podem ser compartilhados apenas com ferramentas de envio de e-mail (como Brevo ou Mailchimp) para viabilizar a newsletter, sempre em conformidade com a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-2">4. Seus Direitos (LGPD)</h2>
            <p className="leading-relaxed">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Confirmar a existência de tratamento de seus dados.</li>
              <li>Acessar, corrigir ou excluir seus dados a qualquer momento.</li>
              <li>Revogar o consentimento para o recebimento de e-mails.</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Para exercer esses direitos, entre em contato pelo nosso <Link href="/contato" className="text-brand-magenta font-semibold hover:underline">Fale Conosco</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}