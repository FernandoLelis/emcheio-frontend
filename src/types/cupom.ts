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
  aplicarEmTodoSite: boolean;
  criadoEm: string;
  condicoes?: string | null;
  categorias?: Categoria[];
  
  // ✅ ESTES SÃO OS CAMPOS QUE ESTAVAM FALTANDO
  origem: string;
  valorDesconto: number | null;
  tipoDesconto: string | null;
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
  aplicarEmTodoSite?: boolean;
  condicoes?: string;
  categoriaIds?: number[];
}