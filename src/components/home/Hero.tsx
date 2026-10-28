"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Importando o useRouter
import { Search } from "lucide-react";

const BUSCAS_POPULARES = [
  "Fone Bluetooth",
  "Air Fryer",
  'Smart TV 55"',
  "Notebook",
  "Tênis Running",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-gray-100 bg-white">
      <BackgroundDecorations />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-magenta/5 px-4 py-1.5 text-xs font-medium text-brand-magenta sm:text-sm">
            🔥 Mais de 10.000 ofertas ativas agora
          </span>
        </div>

        {/* Título */}
        <h1 className="mx-auto mt-6 max-w-4xl text-center text-4xl leading-[1.05] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="font-black">Achou em cheio.</span>{" "}
          <span className="gradient-brand-text font-black">Pagou</span>
          <br className="hidden md:block" />
          <span className="gradient-brand-text font-black"> menos.</span>
        </h1>

        {/* Subtítulo */}
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-text-secondary sm:text-lg lg:text-xl">
          As melhores ofertas da Amazon, Mercado Livre, Shopee e mais — tudo em
          um só lugar.
        </p>

        {/* Busca */}
        <div className="mx-auto mt-8 max-w-2xl">
          <BuscaHero />
        </div>

        {/* Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="hidden text-sm leading-none text-text-secondary sm:inline">
            Popular:
          </span>
          {BUSCAS_POPULARES.map((busca) => (
            <BuscaChip key={busca} termo={busca} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// SUBCOMPONENTE: Barra de busca do Hero
// ==========================================
function BuscaHero() {
  const router = useRouter();
  const [termo, setTermo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termo.trim()) {
      router.push(`/busca?q=${encodeURIComponent(termo.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all focus-within:border-brand-magenta/30 focus-within:shadow-md"
    >
      <input
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="O que você está procurando?"
        className="flex-1 bg-transparent px-3 text-sm text-text-primary outline-none placeholder:text-text-secondary sm:text-base"
      />
      <button
        type="submit"
        className="gradient-brand flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] sm:px-6 sm:py-3"
      >
        <Search className="h-4 w-4" strokeWidth={2.5} />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  );
}

// ==========================================
// SUBCOMPONENTE: Chip de Busca Popular
// ==========================================
function BuscaChip({ termo }: { termo: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/busca?q=${encodeURIComponent(termo)}`);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="rounded-full border-2 border-gray-200 bg-white px-3 py-1.5 text-xs font-medium leading-none text-text-secondary transition-colors hover:border-brand-magenta/60 hover:text-brand-magenta/90 sm:px-4 sm:text-sm"
    >
      {termo}
    </button>
  );
}

// ==========================================
// SUBCOMPONENTE: Decorações de fundo
// ==========================================
function BackgroundDecorations() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-25 blur-[80px] sm:-right-32 sm:-top-32 sm:h-96 sm:w-96 sm:opacity-35 sm:blur-[90px] lg:-right-40 lg:-top-40 lg:h-[500px] lg:w-[500px] lg:opacity-40 lg:blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, #FF0080 0%, #FF6B00 40%, transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full opacity-20 blur-[80px] sm:-left-32 sm:-top-32 sm:h-80 sm:w-80 sm:opacity-25 lg:-left-40 lg:-top-40 lg:h-[400px] lg:w-[400px] lg:opacity-25 lg:blur-[100px] xl:opacity-35"
        style={{
          background: "radial-gradient(circle, #FF6B00 0%, transparent 70%)",
        }}
      />

      {/* Ícone coração */}
      <svg
        className="pointer-events-none absolute left-[8%] top-[20%] hidden h-8 w-8 text-brand-magenta/20 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>

      {/* Ícone nuvem */}
      <svg
        className="pointer-events-none absolute right-[12%] top-[15%] hidden h-10 w-10 text-brand-orange/20 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
        />
      </svg>

      {/* Ícone lâmpada */}
      <svg
        className="pointer-events-none absolute right-[10%] bottom-[30%] hidden h-9 w-9 text-brand-magenta/20 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>

      {/* Ícone lupa */}
      <svg
        className="pointer-events-none absolute left-[10%] bottom-[35%] hidden h-10 w-10 text-brand-orange/20 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </>
  );
}