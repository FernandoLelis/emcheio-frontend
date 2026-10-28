"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Tag,
  Ticket,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { authService } from "@/lib/services";

const NAV_ADMIN = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tags },
  { label: "Ofertas", href: "/admin/ofertas", icon: Tag },
  { label: "Cupons", href: "/admin/cupons", icon: Ticket },
  { label: "Inscritos", href: "/admin/inscritos", icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loggedUser = authService.getUser();
    if (!loggedUser || loggedUser.role !== "ADMIN") {
      router.push("/login");
    } else {
      setUser(loggedUser);
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 overflow-hidden">
      {/* Menu Lateral (Desktop) */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex shrink-0">
        <div className="flex h-18 items-center border-b border-gray-100 px-6">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {NAV_ADMIN.map((item) => {
            const isAtivo = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isAtivo
                    ? "bg-brand-magenta/10 text-brand-magenta"
                    : "text-text-secondary hover:bg-gray-100 hover:text-text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar (Mobile) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <Logo />
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="rounded-lg p-2 text-text-secondary hover:bg-gray-100"
          >
            {menuAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Menu Mobile Expandido */}
        {menuAberto && (
          <nav className="border-b border-gray-200 bg-white px-4 py-4 lg:hidden">
            {NAV_ADMIN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-brand-magenta/10 text-brand-magenta"
                    : "text-text-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </nav>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}