import Link from "next/link";
import { CupomCard } from "@/components/ui/CupomCard";
import { cupomService } from "@/lib/services";
import type { Cupom } from "@/types";

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export async function CuponsAtivos() {
  let cupons: Cupom[] = [];

  try {
    const todos = await cupomService.listarValidos();
    cupons = todos.slice(0, 4);
  } catch (error) {
    console.error("❌ Erro ao buscar cupons:", error);
    return null;
  }

  if (cupons.length === 0) {
    return null;
  }

  return (
    <section className="border-y-2 border-gray-100 bg-[#F2F2F5] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <TicketIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl md:text-3xl">
              Cupons Ativos
            </h2>
          </div>

          <Link
            href="/cupons"
            className="gradient-brand-text hover-magenta-text hidden whitespace-nowrap text-sm font-semibold sm:inline"
          >
            Ver todos →
          </Link>
        </div>

        {/* Grid de 4 colunas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cupons.map((cupom) => (
            <CupomCard key={cupom.id} cupom={cupom} />
          ))}
        </div>

        {/* Link "Ver todos" no mobile */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/cupons"
            className="gradient-brand-text hover-magenta-text text-sm font-semibold"
          >
            Ver todos →
          </Link>
        </div>
      </div>
    </section>
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