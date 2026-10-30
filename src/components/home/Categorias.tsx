import Link from "next/link";
import { categoriaService } from "@/lib/services";
import type { Categoria } from "@/types";
import { CategoryIcon, BatomIcon } from "@/components/ui/CategoryIcon"; // ✅ Importando o componente

export async function Categorias() {
  let categorias: Categoria[] = [];

  try {
    const todas = await categoriaService.listar();
    // ✅ Filtrando categorias com 0 produtos e limitando a 6
    categorias = todas
      .filter((c) => (c._count?.produtos || 0) > 0)
      .slice(0, 6);
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
    return null;
  }

  if (categorias.length === 0) {
    return null;
  }

  return (
    <section className="border-b-2 border-gray-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <GridIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl md:text-3xl">
              Navegue por Categorias
            </h2>
          </div>

          <Link
            href="/categorias"
            className="gradient-brand-text hover-magenta-text hidden whitespace-nowrap text-sm font-semibold sm:inline"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/categoria/${categoria.slug}`}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 text-center shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] transition-all hover:border-brand-magenta/40 hover:shadow-md sm:p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                {/* ✅ Usando o componente compartilhado */}
                <CategoryIcon icone={categoria.icone} className="h-full w-full" />
              </div>

              <span className="text-xs font-semibold leading-tight text-text-primary sm:text-sm">
                {categoria.nome}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/categorias"
            className="gradient-brand-text hover-magenta-text text-sm font-semibold"
          >
            Ver todas →
          </Link>
        </div>
      </div>
    </section>
  );
}

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
      <rect width="7" height="7" x="3" y="3" rx="1" stroke="url(#header-grid-gradient)" />
      <rect width="7" height="7" x="14" y="3" rx="1" stroke="url(#header-grid-gradient)" />
      <rect width="7" height="7" x="14" y="14" rx="1" stroke="url(#header-grid-gradient)" />
      <rect width="7" height="7" x="3" y="14" rx="1" stroke="url(#header-grid-gradient)" />
    </svg>
  );
}