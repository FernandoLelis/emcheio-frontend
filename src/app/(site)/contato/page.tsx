import Link from "next/link";
import { ChevronRight, Mail, MessageCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Fale Conosco — EmCheio",
  description: "Entre em contato com a equipe do EmCheio.",
};

export default function ContatoPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Fale Conosco</span>
        </nav>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
            Fale Conosco
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Tem alguma dúvida, sugestão ou encontrou um preço errado? Adoraríamos ouvir você.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border-2 border-gray-100 bg-gray-50 p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-magenta shadow-sm">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">E-mail</h3>
              <p className="text-sm text-text-secondary mt-1">
                Para contato geral, parcerias ou suporte:
              </p>
              <a
                href="mailto:contato@emcheio.com.br"
                className="mt-2 inline-block text-lg font-semibold text-brand-magenta hover:underline"
              >
                contato@emcheio.com.br
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-magenta shadow-sm">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">WhatsApp</h3>
              <p className="text-sm text-text-secondary mt-1">
                Para assuntos comerciais e parcerias:
              </p>
              <span className="mt-2 inline-block text-lg font-semibold text-gray-400">
                (Em breve)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-magenta shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Horário de Atendimento</h3>
              <p className="text-sm text-text-secondary mt-1">
                Segunda a Sexta, das 09h às 18h (Horário de Brasília).
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Respondemos em até 24 horas úteis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}