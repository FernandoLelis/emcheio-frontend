"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Tag, Ticket, Mail, Loader2 } from "lucide-react";
import {
  produtoService,
  ofertaService,
  cupomService,
  inscritoService,
} from "@/lib/services";

interface Metricas {
  produtos: number;
  ofertas: number;
  cupons: number;
  inscritos: number;
}

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState<Metricas>({
    produtos: 0,
    ofertas: 0,
    cupons: 0,
    inscritos: 0,
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarMetricas() {
      try {
        // ✅ Busca todos os dados em paralelo para ser mais rápido
        const [produtos, ofertas, cupons, inscritos] = await Promise.all([
          produtoService.listar(),
          ofertaService.listar(),
          cupomService.listarValidos(), // Busca apenas os cupons que estão ativos hoje
          inscritoService.listar(),
        ]);

        setMetricas({
          produtos: produtos.length,
          // Consideramos "Oferta Ativa" aquelas marcadas como disponíveis
          ofertas: ofertas.filter((o) => o.disponivel).length,
          cupons: cupons.length,
          inscritos: inscritos.length,
        });
      } catch (error) {
        console.error("❌ Erro ao carregar métricas do dashboard:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarMetricas();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">
          Visão geral do EmCheio em tempo real.
        </p>
      </div>

      {carregando ? (
        <div className="flex h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-magenta" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card: Produtos */}
          <Link
            href="/admin/produtos"
            className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-brand-magenta/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Total de Produtos
              </p>
              <div className="rounded-lg bg-gray-50 p-2 text-gray-400 group-hover:bg-brand-magenta/10 group-hover:text-brand-magenta">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-text-primary">
              {metricas.produtos}
            </p>
          </Link>

          {/* Card: Ofertas */}
          <Link
            href="/admin/ofertas"
            className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-brand-magenta/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Ofertas Ativas
              </p>
              <div className="rounded-lg bg-gray-50 p-2 text-gray-400 group-hover:bg-brand-magenta/10 group-hover:text-brand-magenta">
                <Tag className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-text-primary">
              {metricas.ofertas}
            </p>
          </Link>

          {/* Card: Cupons */}
          <Link
            href="/admin/cupons"
            className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-brand-magenta/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Cupons Ativos
              </p>
              <div className="rounded-lg bg-gray-50 p-2 text-gray-400 group-hover:bg-brand-magenta/10 group-hover:text-brand-magenta">
                <Ticket className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-text-primary">
              {metricas.cupons}
            </p>
          </Link>

          {/* Card: Inscritos */}
          <Link
            href="/admin/inscritos"
            className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-brand-magenta/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Inscritos
              </p>
              <div className="rounded-lg bg-gray-50 p-2 text-gray-400 group-hover:bg-brand-magenta/10 group-hover:text-brand-magenta">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-text-primary">
              {metricas.inscritos}
            </p>
          </Link>
        </div>
      )}

      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-text-secondary">
          Selecione uma opção no menu lateral para começar a gerenciar o conteúdo.
        </p>
      </div>
    </div>
  );
}