import { api } from "@/lib/api";
import type { Oferta } from "@/types";

// Interface para criação/edição de oferta
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
  // ==========================================
  // LEITURA (Público)
  // ==========================================

  /**
   * Lista todas as ofertas (com produto incluído).
   * GET /api/ofertas
   */
  async listar(): Promise<Oferta[]> {
    return api.get<Oferta[]>("/ofertas");
  },

  /**
   * Busca uma oferta por ID.
   * GET /api/ofertas/:id
   */
  async buscarPorId(id: number): Promise<Oferta> {
    return api.get<Oferta>(`/ofertas/${id}`);
  },

  /**
   * Lista todas as ofertas de um produto específico.
   * GET /api/ofertas/produto/:produtoId
   */
  async listarPorProduto(produtoId: number): Promise<Oferta[]> {
    return api.get<Oferta[]>(`/ofertas/produto/${produtoId}`);
  },

  // ==========================================
  // ESCRITA (Protegido - Apenas Admin)
  // ==========================================

  /**
   * Cria uma nova oferta.
   * POST /api/ofertas
   */
  async criar(data: CreateOfertaDto): Promise<Oferta> {
    return api.post<Oferta>("/ofertas", data);
  },

  /**
   * Atualiza uma oferta existente.
   * PUT /api/ofertas/:id
   */
  async atualizar(
    id: number,
    data: Partial<CreateOfertaDto>,
  ): Promise<Oferta> {
    return api.put<Oferta>(`/ofertas/${id}`, data);
  },

  /**
   * Remove uma oferta.
   * DELETE /api/ofertas/:id
   */
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/ofertas/${id}`);
  },
};