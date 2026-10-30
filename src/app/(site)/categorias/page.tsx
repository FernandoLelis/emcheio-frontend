import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categoriaService } from "@/lib/services";
import type { Categoria } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon"; // ✅ Usando o componente compartilhado

// ==========================================
// METADATA (SEO)
// ==========================================
export const metadata = {
  title: "Categorias — EmCheio",
  description:
    "Navegue por todas as categorias de produtos. Encontre as melhores ofertas por categoria.",
};

// ==========================================
// COMPONENTE PRINCIPAL (Server Component)
// ==========================================
export default async function CategoriasPage() {
  let categorias: Categoria[] = [];

  try {
    categorias = await categoriaService.listar();
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
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
          <span className="font-medium text-text-primary">Categorias</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <GridIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Categorias
            </h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {categorias.length}{" "}
            {categorias.length === 1
              ? "categoria disponível"
              : "categorias disponíveis"}{" "}
            para você explorar
          </p>
        </div>

        {/* Grid de categorias */}
        {categorias.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              Nenhuma categoria disponível
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Estamos trabalhando para trazer novas categorias em breve.
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
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-100 bg-white p-6 text-center shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] transition-all hover:border-brand-magenta/40 hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                  {/* ✅ Usando o componente compartilhado */}
                  <CategoryIcon icone={categoria.icone} className="h-full w-full" />
                </div>

                <span className="text-sm font-semibold text-text-primary sm:text-base">
                  {categoria.nome}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ÍCONE DO HEADER: Grid
// ==========================================
function GridIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <linearGradient id="header-grid-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF0080" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      <rect
        width="7"
        height="7"
        x="3"
        y="3"
        rx="1"
        stroke="url(#header-grid-gradient)"
      />
      <rect
        width="7"
        height="7"
        x="14"
        y="3"
        rx="1"
        stroke="url(#header-grid-gradient)"
      />
      <rect
        width="7"
        height="7"
        x="14"
        y="14"
        rx="1"
        stroke="url(#header-grid-gradient)"
      />
      <rect
        width="7"
        height="7"
        x="3"
        y="14"
        rx="1"
        stroke="url(#header-grid-gradient)"
      />
    </svg>
  );
}