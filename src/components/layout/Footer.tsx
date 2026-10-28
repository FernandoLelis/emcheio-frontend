import Link from "next/link";
import { Logo } from "./Logo";

const NAVEGACAO = [
  { label: "Ofertas do Dia", href: "/ofertas" },
  { label: "Cupons", href: "/cupons" },
  { label: "Categorias", href: "/categorias" },
  { label: "Em Alta", href: "/em-alta" },
  { label: "Novidades", href: "/novidades" },
];

const SOBRE = [
  { label: "Quem somos", href: "/sobre" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Termos de uso", href: "/termos" },
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Fale conosco", href: "/contato" },
];

const REDES_SOCIAIS = [
  { label: "Instagram", href: "https://instagram.com/emcheio", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/emcheio", icon: FacebookIcon },
  { label: "YouTube", href: "https://youtube.com/@emcheio", icon: YoutubeIcon },
  { label: "TikTok", href: "https://tiktok.com/@emcheio", icon: TiktokIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Grid: 2 colunas no mobile, 4 colunas no desktop */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {/* Coluna 1: Logo + Descrição + Redes Sociais
              Mobile: ocupa 2 colunas (largura total)
              Desktop: ocupa 1 coluna */}
          <div className="col-span-2 flex flex-col items-start gap-4 text-left lg:col-span-1">
            <Logo variant="light" />
            <p className="text-sm leading-relaxed text-gray-400">
              As melhores ofertas da internet em um só lugar. Economize tempo e
              dinheiro.
            </p>
            <div className="flex items-center gap-2">
              {REDES_SOCIAIS.map((rede) => {
                const Icon = rede.icon;
                return (
                  <a
                    key={rede.label}
                    href={rede.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={rede.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-500 text-gray-400 transition-colors hover:border-brand-magenta hover:text-brand-magenta"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="flex flex-col items-start text-left">
            <h3 className="mb-4 text-sm font-bold text-white">Navegação</h3>
            <ul className="space-y-2">
              {NAVEGACAO.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-gradient-text text-sm text-gray-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Sobre */}
          <div className="flex flex-col items-start text-left">
            <h3 className="mb-4 text-sm font-bold text-white">Sobre</h3>
            <ul className="space-y-2">
              {SOBRE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-gradient-text text-sm text-gray-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Aviso de Afiliado
              Mobile: ocupa 2 colunas (largura total)
              Desktop: ocupa 1 coluna */}
          <div className="col-span-2 flex flex-col items-start text-left lg:col-span-1">
            <h3 className="mb-4 text-sm font-bold text-white">
              Aviso de Afiliado
            </h3>
            <p className="text-xs leading-relaxed text-gray-400">
              O EmCheio participa de programas de afiliados. Ao comprar através
              dos nossos links, podemos receber uma comissão sem custo
              adicional para você.
            </p>
          </div>
        </div>

        {/* Linha de copyright */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} EmCheio — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// ÍCONES
// ==========================================
function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}