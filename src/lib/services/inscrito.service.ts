import { api } from "@/lib/api";
import type { Inscrito, CreateInscritoDto } from "@/types";

export const inscritoService = {
  // ==========================================
  // ESCRITA (Público)
  // ==========================================

  /**
   * Inscreve um novo usuário na newsletter.
   * POST /api/inscritos
   */
  async criar(dados: CreateInscritoDto): Promise<Inscrito> {
    return api.post<Inscrito>("/inscritos", dados);
  },

  // ==========================================
  // LEITURA (Protegido - Apenas Admin)
  // ==========================================

  /**
   * Lista todos os inscritos (apenas admin).
   * GET /api/inscritos
   */
  async listar(): Promise<Inscrito[]> {
    return api.get<Inscrito[]>("/inscritos");
  },

  /**
   * Busca um inscrito por ID (apenas admin).
   * GET /api/inscritos/:id
   */
  async buscarPorId(id: number): Promise<Inscrito> {
    return api.get<Inscrito>(`/inscritos/${id}`);
  },

  // ==========================================
  // EXCLUSÃO (Protegido - Apenas Admin)
  // ==========================================

  /**
   * Remove um inscrito (apenas admin).
   * DELETE /api/inscritos/:id
   */
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/inscritos/${id}`);
  },
};