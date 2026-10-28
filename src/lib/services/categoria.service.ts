import { api } from "@/lib/api";
import type { Categoria } from "@/types";

export interface CreateCategoriaDto {
  nome: string;
  slug: string;
  icone?: string;
}

export const categoriaService = {
  // ==========================================
  // LEITURA (Público)
  // ==========================================

  /**
   * Lista todas as categorias.
   * GET /api/categorias
   */
  async listar(): Promise<Categoria[]> {
    return api.get<Categoria[]>("/categorias");
  },

  /**
   * Busca uma categoria por ID.
   * GET /api/categorias/:id
   */
  async buscarPorId(id: number): Promise<Categoria> {
    return api.get<Categoria>(`/categorias/${id}`);
  },

  /**
   * Busca uma categoria por slug.
   * GET /api/categorias/slug/:slug
   */
  async buscarPorSlug(slug: string): Promise<Categoria> {
    return api.get<Categoria>(`/categorias/slug/${slug}`);
  },

  // ==========================================
  // ESCRITA (Protegido - Apenas Admin)
  // ==========================================

  /**
   * Cria uma nova categoria.
   * POST /api/categorias
   */
  async criar(data: CreateCategoriaDto): Promise<Categoria> {
    return api.post<Categoria>("/categorias", data);
  },

  /**
   * Atualiza uma categoria existente.
   * PUT /api/categorias/:id
   */
  async atualizar(
    id: number,
    data: Partial<CreateCategoriaDto>,
  ): Promise<Categoria> {
    return api.put<Categoria>(`/categorias/${id}`, data);
  },

  /**
   * Remove uma categoria.
   * DELETE /api/categorias/:id
   */
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/categorias/${id}`);
  },
};