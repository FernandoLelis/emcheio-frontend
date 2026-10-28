import { api } from "@/lib/api";
import type { Cupom } from "@/types";

// Interface para criação/edição de cupom
export interface CreateCupomDto {
  loja: string;
  codigo: string;
  descricao?: string;
  descontoTexto?: string;
  urlAfiliado?: string;
  validadeInicio?: string; // Formato ISO (YYYY-MM-DD ou datetime completo)
  validadeFim?: string;
  destaque?: boolean;
}

export const cupomService = {
  // ==========================================
  // LEITURA (Público)
  // ==========================================

  /**
   * Lista todos os cupons (inclusive vencidos, para o admin).
   * GET /api/cupons
   */
  async listar(): Promise<Cupom[]> {
    return api.get<Cupom[]>("/cupons");
  },

  /**
   * Lista apenas os cupons válidos (que o usuário pode usar hoje).
   * GET /api/cupons/validos
   */
  async listarValidos(): Promise<Cupom[]> {
    return api.get<Cupom[]>("/cupons/validos");
  },

  /**
   * Busca um cupom por ID.
   * GET /api/cupons/:id
   */
  async buscarPorId(id: number): Promise<Cupom> {
    return api.get<Cupom>(`/cupons/${id}`);
  },

  // ==========================================
  // ESCRITA (Protegido - Apenas Admin)
  // ==========================================

  /**
   * Cria um novo cupom.
   * POST /api/cupons
   */
  async criar(data: CreateCupomDto): Promise<Cupom> {
    return api.post<Cupom>("/cupons", data);
  },

  /**
   * Atualiza um cupom existente.
   * PUT /api/cupons/:id
   */
  async atualizar(
    id: number,
    data: Partial<CreateCupomDto>,
  ): Promise<Cupom> {
    return api.put<Cupom>(`/cupons/${id}`, data);
  },

  /**
   * Remove um cupom.
   * DELETE /api/cupons/:id
   */
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/cupons/${id}`);
  },
};