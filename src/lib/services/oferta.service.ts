import { api } from "@/lib/api";
import type { Oferta } from "@/types";

export interface CreateOfertaDto {
  produtoId: number;
  loja: string;
  precoAtual: number;
  precoOriginal?: number;
  urlAfiliado: string;
  disponivel?: boolean;
  destaque?: boolean;
}

export const ofertaService = {
  async listar(): Promise<Oferta[]> {
    return api.get<Oferta[]>("/ofertas");
  },
  // ✅ NOVO MÉTODO
  async getContagem(): Promise<{ total: number }> {
    return api.get<{ total: number }>("/ofertas/contagem");
  },
  async buscarPorId(id: number): Promise<Oferta> {
    return api.get<Oferta>(`/ofertas/${id}`);
  },
  async listarPorProduto(produtoId: number): Promise<Oferta[]> {
    return api.get<Oferta[]>(`/ofertas/produto/${produtoId}`);
  },
  async criar(data: CreateOfertaDto): Promise<Oferta> {
    return api.post<Oferta>("/ofertas", data);
  },
  async atualizar(id: number, data: Partial<CreateOfertaDto>): Promise<Oferta> {
    return api.put<Oferta>(`/ofertas/${id}`, data);
  },
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/ofertas/${id}`);
  },
};