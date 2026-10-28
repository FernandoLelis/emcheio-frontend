import { api } from "@/lib/api";
import type { LoginResponse, User } from "@/types/user";

const TOKEN_KEY = "@EmCheio:token";
const USER_KEY = "@EmCheio:user";

export const authService = {
  /**
   * Faz o login na API e salva o token no localStorage
   */
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", { email, senha });

    // Salva no localStorage (só funciona no browser)
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Remove o token e os dados do usuário (logout)
   */
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Recupera o token salvo
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Recupera os dados do usuário logado
   */
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Verifica se o usuário está logado E é ADMIN
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === "ADMIN";
  },
};