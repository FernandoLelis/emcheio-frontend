import { api } from "@/lib/api";
import type { Produto } from "@/types";

export interface CreateProdutoDto {
  nome: string;
  slug: string;
  descricao?: string;
  marca?: string;
  imagemUrl?: string;
  categoriaId?: number;
}

export const produtoService = {
  // ==========================================
  // LEITURA (Público)
  // ==========================================

  /**
   * Lista todos os produtos (com categoria e ofertas).
   * GET /api/produtos
   */
  async listar(): Promise<Produto[]> {
    return api.get<Produto[]>("/produtos");
  },

  /**
   * Busca produtos por termo (nome, marca, descrição ou categoria).
   * GET /api/produtos/busca?q=termo
   */
  async buscar(termo: string): Promise<Produto[]> {
    // ✅ encodeURIComponent garante que espaços e acentos não quebrem a URL
    return api.get<Produto[]>(`/produtos/busca?q=${encodeURIComponent(termo)}`);
  },

  /**
   * Busca um produto por ID (com categoria e ofertas).
   * GET /api/produtos/:id
   */
  async buscarPorId(id: number): Promise<Produto> {
    return api.get<Produto>(`/produtos/${id}`);
  },

  /**
   * Busca um produto por slug (com categoria e ofertas).
   * GET /api/produtos/slug/:slug
   */
  async buscarPorSlug(slug: string): Promise<Produto> {
    return api.get<Produto>(`/produtos/slug/${slug}`);
  },

  // ==========================================
  // ESCRITA (Protegido - Apenas Admin)
  // ==========================================

  /**
   * Cria um novo produto.
   * POST /api/produtos
   */
  async criar(data: CreateProdutoDto): Promise<Produto> {
    return api.post<Produto>("/produtos", data);
  },

  /**
   * Atualiza um produto existente.
   * PUT /api/produtos/:id
   */
  async atualizar(
    id: number,
    data: Partial<CreateProdutoDto>,
  ): Promise<Produto> {
    return api.put<Produto>(`/produtos/${id}`, data);
  },

  /**
   * Remove um produto.
   * DELETE /api/produtos/:id
   */
  async remover(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/produtos/${id}`);
  },
};