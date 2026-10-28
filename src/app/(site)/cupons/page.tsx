import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cupomService } from "@/lib/services";
import { CupomCard } from "@/components/ui/CupomCard";
import type { Cupom } from "@/types";

// ==========================================
// METADATA (SEO)
// ==========================================
export const metadata = {
  title: "Cupons — EmCheio",
  description:
    "Todos os cupons de desconto válidos nas melhores lojas. Copie e economize.",
};

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function CuponsPage() {
  let cupons: Cupom[] = [];

  try {
    cupons = await cupomService.listarValidos();
  } catch (error) {
    console.error("❌ Erro ao buscar cupons:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover-gradient-text transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">Cupons</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <TicketIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Cupons
            </h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {cupons.length}{" "}
            {cupons.length === 1
              ? "cupom válido disponível"
              : "cupons válidos disponíveis"}{" "}
            nas melhores lojas
          </p>
        </div>

        {/* Grid de cupons */}
        {cupons.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhum cupom válido no momento
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Estamos negociando novos cupons. Volte em breve!
            </p>
            <Link
              href="/"
              className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Voltar para Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cupons.map((cupom) => (
              <CupomCard key={cupom.id} cupom={cupom} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ÍCONE DE CUPOM — gradiente
// ==========================================
function TicketIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <defs>
        <linearGradient id="ticketGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF0080" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>

      <path
        d="M3 8 C3 6.89543 3.89543 6 5 6 L27 6 C28.1046 6 29 6.89543 29 8 L29 12 C27.3431 12 26 13.3431 26 15 C26 16.6569 27.3431 18 29 18 L29 22 C29 23.1046 28.1046 24 27 24 L5 24 C3.89543 24 3 23.1046 3 22 L3 18 C4.65685 18 6 16.6569 6 15 C6 13.3431 4.65685 12 3 12 Z"
        fill="url(#ticketGradient)"
      />

      <line
        x1="16"
        y1="9"
        x2="16"
        y2="21"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />

      <circle cx="16" cy="7" r="1.5" fill="#FFFFFF" />
      <circle cx="16" cy="23" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}