export interface Categoria {
  id: number;
  nome: string;
  slug: string;
  icone: string | null;
  criadoEm: string;
  // ✅ Adicionado para contagem de produtos (vem da API)
  _count?: {
    produtos: number;
  };
}