import { Produto } from "./produto";

export interface Oferta {
  id: number;
  produtoId: number;
  loja: string;
  precoAtual: number;
  precoOriginal: number | null;
  urlAfiliado: string;
  disponivel: boolean;
  destaque: boolean;
  criadoEm: string;
  atualizadoEm: string;
  produto?: Produto;
}