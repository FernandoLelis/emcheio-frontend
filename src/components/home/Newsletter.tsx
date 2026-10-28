"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { inscritoService } from "@/lib/services";
import { ApiError } from "@/lib/api";

type Status = "idle" | "enviando" | "sucesso" | "erro";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("enviando");
    setMensagemErro("");

    try {
      await inscritoService.criar({ email });
      setStatus("sucesso");
      setEmail("");

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("erro");

      if (error instanceof ApiError) {
        if (error.status === 409) {
          setMensagemErro("Este e-mail já está inscrito!");
        } else {
          setMensagemErro(error.message);
        }
      } else {
        setMensagemErro("Erro ao inscrever. Tente novamente.");
      }

      setTimeout(() => {
        setStatus("idle");
        setMensagemErro("");
      }, 5000);
    }
  };

  const textoBotao = () => {
    if (status === "enviando") return "Enviando...";
    if (status === "sucesso") return "Inscrito!";
    return "Inscrever-se";
  };

  return (
    <section className="gradient-brand relative overflow-hidden py-12 sm:py-16">
      {/* Círculos decorativos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[15%] top-[20%] h-3 w-3 rounded-full border-2 border-white/30" />
        <div className="absolute right-[20%] top-[15%] h-4 w-4 rounded-full border-2 border-white/30" />
        <div className="absolute bottom-[20%] left-[45%] h-3 w-3 rounded-full border-2 border-white/30" />
        <div className="absolute bottom-[30%] right-[15%] h-3 w-3 rounded-full border-2 border-white/30" />
      </div>

      {/* Ícone nuvem decorativa */}
      <svg
        className="pointer-events-none absolute bottom-[20%] left-[35%] hidden h-10 w-10 text-white/20 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
        />
      </svg>

      {/* Forma curva branca */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[200px] w-[300px] sm:h-[250px] sm:w-[400px]">
        <svg
          viewBox="0 0 400 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M400,0 C350,80 300,120 250,150 C180,190 100,220 0,250 L400,250 Z"
            fill="#FFFFFF"
            opacity="0.08"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Lado esquerdo: ícone + texto */}
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:w-1/2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
              <Mail
                className="h-8 w-8 text-white sm:h-10 sm:w-10"
                strokeWidth={1.75}
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Receba as melhores ofertas no seu e-mail
              </h2>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                Promoções exclusivas, cupons e novidades direto na sua caixa de
                entrada.
              </p>
            </div>
          </div>

          {/* Lado direito: formulário */}
          <div className="w-full lg:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-xl sm:bg-white sm:p-1.5"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                disabled={status === "enviando" || status === "sucesso"}
                className="h-12 w-full appearance-none rounded-xl border-0 bg-white px-4 text-base text-text-primary outline-none placeholder:text-text-secondary disabled:opacity-60 sm:h-12 sm:flex-1 sm:rounded-lg sm:bg-transparent"
              />
              <button
                type="submit"
                disabled={status === "enviando" || status === "sucesso"}
                className="h-12 w-full shrink-0 rounded-xl bg-brand-magenta px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:rounded-lg"
              >
                {textoBotao()}
              </button>
            </form>

            {status === "sucesso" && (
              <p className="mt-2 text-center text-sm font-semibold text-white sm:text-left">
                ✅ Pronto! Confira sua caixa de entrada.
              </p>
            )}

            {status === "erro" && (
              <p className="mt-2 text-center text-sm font-semibold text-white sm:text-left">
                ⚠️ {mensagemErro}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}