import { api } from "@/lib/api";
import type { Cupom } from "@/types";

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

export const cupomService = {
  async listar(): Promise<Cupom[]> {
    return api.get<Cupom[]>("/cupons");
  },
  async listarValidos(): Promise<Cupom[]> {
    return api.get<Cupom[]>("/cupons/validos");
  },
  async buscarPorId(id: number): Promise<Cupom> {
    return api.get<Cupom>(`/cupons/${id}`);
  },
  async criar(data: CreateCupomDto): Promise<Cupom> {
    return api.post<Cupom>("/cupons", data);
  },
  async atualizar(id: number, data: Partial<CreateCupomDto>): Promise<Cupom> {
    return api.put<Cupom>(`/cupons/${id}`, data);
  },
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/cupons/${id}`);
  },
};