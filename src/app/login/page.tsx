"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2 } from "lucide-react";
import { authService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import { Logo } from "@/components/layout/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await authService.login(email, senha);
      // Se o login der certo, redireciona para o painel admin
      router.push("/admin");
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-3xl border-2 border-gray-100 bg-white p-8 shadow-sm sm:p-10">
      {/* Header */}
      <div className="flex flex-col items-center">
        <Logo />
        <h2 className="mt-6 text-center text-2xl font-bold text-text-primary">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Área restrita para administradores do EmCheio.
        </p>
      </div>

      {/* Formulário */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {erro && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
            {erro}
          </div>
        )}

        <div className="space-y-4">
          {/* Campo E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary"
            >
              E-mail
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm text-text-primary placeholder:text-gray-400 focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                placeholder="admin@emcheio.com.br"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-text-primary"
            >
              Senha
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="block w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm text-text-primary placeholder:text-gray-400 focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={carregando}
          className="gradient-brand flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {carregando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      {/* Voltar para home */}
      <p className="text-center text-sm text-text-secondary">
        Não é administrador?{" "}
        <Link
          href="/"
          className="hover-gradient-text font-semibold text-brand-magenta"
        >
          Voltar para a loja
        </Link>
      </p>
    </div>
  );
}