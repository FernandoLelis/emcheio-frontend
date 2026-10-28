"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ Importando useRouter
import { useState } from "react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Ofertas", href: "/ofertas" },
  { label: "Em Alta", href: "/em-alta" },
  { label: "Novidades", href: "/novidades" },
  { label: "Cupons", href: "/cupons" },
  { label: "Categorias", href: "/categorias" },
  { label: "Sobre", href: "/sobre" },
];

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Busca (tablet e desktop - 768px+) */}
        <div className="hidden flex-1 md:flex md:max-w-2xl">
          <BuscaInput />
        </div>

        {/* Navegação (desktop - 1100px+) */}
        <nav className="hidden items-center gap-2 min-[1100px]:flex">
          {NAV_LINKS.map((link) => {
            const isAtivo =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isAtivo
                    ? "gradient-brand-text font-semibold"
                    : "hover-gradient-text text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Ícone notificação (desktop - 1100px+) */}
        <button
          type="button"
          className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:text-brand-magenta min-[1100px]:block"
          aria-label="Notificações"
        >
          <BellIcon />
        </button>

        {/* Menu mobile (hamburger) - abaixo de 1100px */}
        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-text-primary transition-colors hover:text-brand-magenta min-[1100px]:hidden"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Menu mobile expandido */}
      {menuAberto && (
        <nav className="border-t border-gray-100 bg-white min-[1100px]:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
            {/* Busca dentro do menu — apenas para mobile (< 768px) */}
            <div className="md:hidden">
              {/* ✅ Passamos uma função para fechar o menu ao buscar */}
              <BuscaInput onSearch={() => setMenuAberto(false)} />
            </div>

            <div className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const isAtivo =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-3 text-base font-medium transition-all ${
                      isAtivo
                        ? "gradient-brand-text font-semibold"
                        : "hover-gradient-text text-text-secondary"
                    }`}
                    onClick={() => setMenuAberto(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

// ==========================================
// SUBCOMPONENTE: Input de busca
// ==========================================
function BuscaInput({ onSearch }: { onSearch?: () => void }) {
  const router = useRouter();
  const [termo, setTermo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (termo.trim()) {
      // ✅ Redireciona para a página de busca com o termo na URL
      router.push(`/busca?q=${encodeURIComponent(termo.trim())}`);
      
      // Se estiver no mobile, fecha o menu
      if (onSearch) {
        onSearch();
      }
      
      // Limpa o campo após buscar (opcional, mas boa prática)
      // setTermo(""); 
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-xl border border-gray-200 bg-white py-1 pl-4 pr-1 transition-all focus-within:border-brand-magenta/30 focus-within:shadow-sm"
    >
      <input
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Busque por produto, marca ou categoria..."
        className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
      />
      <button
        type="submit"
        className="gradient-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-transform hover:scale-105"
        aria-label="Buscar"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

// ==========================================
// ÍCONES
// ==========================================
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-magenta ring-2 ring-white" />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}