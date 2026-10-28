export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  nome: string;
  email: string;
  role: Role;
  criadoEm: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}