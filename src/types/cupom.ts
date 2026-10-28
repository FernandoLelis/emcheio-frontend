export interface Cupom {
  id: number;
  loja: string;
  codigo: string;
  descricao: string | null;
  descontoTexto: string | null;
  urlAfiliado: string | null;
  validadeInicio: string | null;
  validadeFim: string | null;
  destaque: boolean;
  criadoEm: string;
}