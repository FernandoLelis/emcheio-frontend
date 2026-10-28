import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ofertaService } from "@/lib/services";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Oferta } from "@/types";

// ==========================================
// METADATA (SEO)
// ==========================================
export const metadata = {
  title: "Ofertas — EmCheio",
  description:
    "Todas as ofertas disponíveis nas melhores lojas. Compare preços e economize.",
};

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function OfertasPage() {
  let ofertas: Oferta[] = [];

  try {
    const todas = await ofertaService.listar();
    // Filtra apenas disponíveis e ordena por mais recentes
    ofertas = todas
      .filter((o) => o.disponivel)
      .sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
      );
  } catch (error) {
    console.error("❌ Erro ao buscar ofertas:", error);
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
          <span className="font-medium text-text-primary">Ofertas</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/emoji/48/fire.png"
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 sm:h-9 sm:w-9"
            />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Ofertas
            </h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {ofertas.length}{" "}
            {ofertas.length === 1
              ? "oferta disponível"
              : "ofertas disponíveis"}{" "}
            nas melhores lojas
          </p>
        </div>

        {/* Grid de ofertas */}
        {ofertas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhuma oferta disponível no momento
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Estamos trabalhando para trazer novas ofertas em breve.
            </p>
            <Link
              href="/"
              className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Voltar para Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ofertas.map((oferta) => (
              <ProductCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}