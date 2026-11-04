import type { Categoria } from "./categoria";

export interface Cupom {
  id: number;
  loja: string;
  codigo: string;
  descricao: string | null;
  descontoTexto: string | null;
  urlAfiliado: string | null;
  validadeInicio: string | null;
  validadeFim: string | null;
  destaque: boolean;
  aplicarEmTodoSite: boolean; // ✅ Adicionado
  criadoEm: string;
  condicoes?: string | null;
  categorias?: Categoria[];
}

export interface CreateCupomDto {
  loja: string;
  codigo: string;
  descricao?: string;
  descontoTexto?: string;
  urlAfiliado?: string;
  validadeInicio?: string;
  validadeFim?: string;
  destaque?: boolean;
  aplicarEmTodoSite?: boolean; // ✅ Adicionado
  condicoes?: string;
  categoriaIds?: number[];
}