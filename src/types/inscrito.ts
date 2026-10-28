export interface Inscrito {
  id: number;
  nome: string | null;
  email: string;
  whatsapp: string | null;
  aceitaEmail: boolean;
  aceitaWhatsapp: boolean;
  criadoEm: string;
}

export interface CreateInscritoDto {
  nome?: string;
  email: string;
  whatsapp?: string;
  aceitaEmail?: boolean;
  aceitaWhatsapp?: boolean;
}