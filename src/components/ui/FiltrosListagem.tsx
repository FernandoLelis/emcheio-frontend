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
    // ✅ Fundo removido, substituído por uma borda inferior sutil
    <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-gray-100 pb-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <Filter className="h-4 w-4" />
        Filtrar:
      </div>

      {/* Filtro de Loja */}
      <select
        value={lojaAtual}
        onChange={(e) => atualizarFiltro("loja", e.target.value)}
        className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-text-primary outline-none transition-colors focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta"
      >
        <option value="">Todas as lojas</option>
        {lojasDisponiveis.map((loja) => (
          <option key={loja} value={loja}>
            {loja}
          </option>
        ))}
      </select>

      {/* Filtro de Categoria (Opcional) */}
      {mostrarFiltroCategoria && (
        <select
          value={categoriaAtual}
          onChange={(e) => atualizarFiltro("categoria", e.target.value)}
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-text-primary outline-none transition-colors focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta"
        >
          <option value="">Todas as categorias</option>
          {categoriasDisponiveis.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.nome}
            </option>
          ))}
        </select>
      )}

      {/* Ordenação */}
      <select
        value={ordemAtual}
        onChange={(e) => atualizarFiltro("ordem", e.target.value)}
        className="ml-auto cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-text-primary outline-none transition-colors focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta"
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