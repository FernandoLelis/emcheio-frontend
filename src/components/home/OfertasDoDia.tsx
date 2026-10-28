"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Oferta } from "@/types";

interface OfertasDoDiaProps {
  ofertas: Oferta[];
}

export function OfertasDoDia({ ofertas }: OfertasDoDiaProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);

  const scrollParaEsquerda = () => {
    carrosselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollParaDireita = () => {
    carrosselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (ofertas.length === 0) {
    return null;
  }

  return (
    <section className="border-b-2 border-gray-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/emoji/48/fire.png"
              alt=""
              width={28}
              height={28}
              className="h-6 w-6 sm:h-7 sm:w-7"
            />
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl md:text-3xl">
              Ofertas do Dia
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ofertas"
              className="gradient-brand-text hover-magenta-text hidden whitespace-nowrap text-sm font-semibold sm:inline"
            >
              Ver todas →
            </Link>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={scrollParaEsquerda}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-text-secondary transition-colors hover:border-brand-magenta hover:text-brand-magenta"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={scrollParaDireita}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-text-secondary transition-colors hover:border-brand-magenta hover:text-brand-magenta"
                aria-label="Próximo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carrossel */}
        <div
          ref={carrosselRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0"
        >
          {ofertas.map((oferta) => (
            <div
              key={oferta.id}
              className="w-[160px] shrink-0 snap-start sm:w-[180px] md:w-[200px]"
            >
              <ProductCard oferta={oferta} />
            </div>
          ))}
        </div>

        {/* Link "Ver todas" no mobile */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/ofertas"
            className="gradient-brand-text hover-magenta-text text-sm font-semibold"
          >
            Ver todas →
          </Link>
        </div>
      </div>
    </section>
  );
}