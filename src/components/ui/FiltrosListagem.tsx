"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";

interface FiltrosListagemProps {
  lojasDisponiveis: string[];
  categoriasDisponiveis?: { id: number; nome: string; slug: string }[];
  mostrarFiltroCategoria?: boolean;
  opcoesOrdenacao: { value: string; label: string }[];
}

export function FiltrosListagem({
  lojasDisponiveis,
  categoriasDisponiveis = [],
  mostrarFiltroCategoria = false,
  opcoesOrdenacao,
}: FiltrosListagemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lojaAtual = searchParams.get("loja") || "";
  const categoriaAtual = searchParams.get("categoria") || "";
  const ordemAtual = searchParams.get("ordem") || opcoesOrdenacao[0].value;

  const atualizarFiltro = (chave: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (valor) {
      params.set(chave, valor);
    } else {
      params.delete(chave);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:gap-4">
      
      {/* Título do Filtro (Oculto no mobile) */}
      <div className="hidden items-center gap-2 text-sm font-semibold text-text-secondary md:flex">
        <Filter className="h-4 w-4" />
        Filtrar:
      </div>

      {/* ✅ NOVO CONTAINER: Grid para não estourar a tela */}
      <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center md:gap-4">
        <select
          value={lojaAtual}
          onChange={(e) => atualizarFiltro("loja", e.target.value)}
          // ✅ Adicionado w-full, min-w-0 e truncate
          className="w-full min-w-0 cursor-pointer truncate rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta md:w-auto md:flex-none"
        >
          <option value="">Lojas</option>
          {lojasDisponiveis.map((loja) => (
            <option key={loja} value={loja}>
              {loja}
            </option>
          ))}
        </select>

        {mostrarFiltroCategoria && (
          <select
            value={categoriaAtual}
            onChange={(e) => atualizarFiltro("categoria", e.target.value)}
            // ✅ Adicionado w-full, min-w-0 e truncate
            className="w-full min-w-0 cursor-pointer truncate rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta md:w-auto md:flex-none"
          >
            <option value="">Categorias</option>
            {categoriasDisponiveis.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Ordenação */}
      <select
        value={ordemAtual}
        onChange={(e) => atualizarFiltro("ordem", e.target.value)}
        className="w-full cursor-pointer truncate rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta md:ml-auto md:w-auto md:max-w-[200px]"
      >
        {opcoesOrdenacao.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}