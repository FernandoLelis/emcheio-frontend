interface StoreLogoProps {
  loja: string;
  className?: string;
}

// ==========================================
// MAPA DE LOJAS — arquivos locais em /public/logos/
// ==========================================
const LOJAS: Record<string, { arquivo: string; alt: string }> = {
  amazon: { arquivo: "/logos/amazon.svg", alt: "Amazon" },
  "mercado livre": {
    arquivo: "/logos/mercado-livre.svg",
    alt: "Mercado Livre",
  },
  mercadolivre: {
    arquivo: "/logos/mercado-livre.svg",
    alt: "Mercado Livre",
  },
  shopee: { arquivo: "/logos/shopee.svg", alt: "Shopee" },
  magalu: { arquivo: "/logos/magalu.svg", alt: "Magalu" },
  magazine: { arquivo: "/logos/magalu.svg", alt: "Magalu" },
  nike: { arquivo: "/logos/nike.svg", alt: "Nike" },
};

export function StoreLogo({ loja, className = "" }: StoreLogoProps) {
  const normalizada = loja.toLowerCase().trim();
  const config = LOJAS[normalizada];

  if (config) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.arquivo}
          alt={config.alt}
          className="h-5 w-auto max-w-[80px] object-contain"
        />
      </div>
    );
  }

  // Fallback — texto simples
  return (
    <span
      className={`text-xs font-bold uppercase tracking-wide text-text-secondary ${className}`}
    >
      {loja}
    </span>
  );
}