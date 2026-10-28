import { Categoria } from "./categoria";
import { Oferta } from "./oferta";

export interface Produto {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  marca: string | null;
  imagemUrl: string | null;
  categoriaId: number | null;
  criadoEm: string;
  atualizadoEm: string;
  categoria: Categoria | null;
  ofertas?: Oferta[];
}