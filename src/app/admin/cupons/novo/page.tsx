"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { cupomService } from "@/lib/services";
import { ApiError } from "@/lib/api";

const LOJAS_DISPONIVEIS = [
  { value: "Amazon", label: "Amazon" },
  { value: "Mercado Livre", label: "Mercado Livre" },
  { value: "Shopee", label: "Shopee" },
  { value: "Magalu", label: "Magalu" },
  { value: "Outra", label: "Outra" },
];

export default function NovoCupomPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    loja: "Amazon",
    codigo: "",
    descricao: "",
    descontoTexto: "",
    urlAfiliado: "",
    validadeInicio: "",
    validadeFim: "",
    destaque: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await cupomService.criar({
        loja: formData.loja,
        codigo: formData.codigo,
        descricao: formData.descricao || undefined,
        descontoTexto: formData.descontoTexto || undefined,
        urlAfiliado: formData.urlAfiliado || undefined,
        // ✅ Converte a data/hora local (YYYY-MM-DDTHH:mm) para ISO UTC
        validadeInicio: formData.validadeInicio ? new Date(formData.validadeInicio).toISOString() : undefined,
        validadeFim: formData.validadeFim ? new Date(formData.validadeFim).toISOString() : undefined,
        destaque: formData.destaque,
      });

      router.push("/admin/cupons");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao cadastrar cupom. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cupons"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Novo Cupom</h1>
          <p className="text-sm text-text-secondary">
            Cadastre um novo código de desconto.
          </p>
        </div>
      </div>

      {erro && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Loja *
            </label>
            <select
              name="loja"
              required
              value={formData.loja}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            >
              {LOJAS_DISPONIVEIS.map((loja) => (
                <option key={loja.value} value={loja.value}>
                  {loja.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Código do Cupom *
            </label>
            <input
              type="text"
              name="codigo"
              required
              value={formData.codigo}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 font-mono text-sm uppercase focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="Ex: EMCHEIO20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Desconto (Texto) *
            </label>
            <input
              type="text"
              name="descontoTexto"
              required
              value={formData.descontoTexto}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="Ex: R$ 20 OFF ou 10% OFF"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Descrição Curta
            </label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="Ex: Em compras acima de R$ 200"
            />
          </div>

          {/* ✅ AGORA É DATETIME-LOCAL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Válido a partir de (Data e Hora)
            </label>
            <input
              type="datetime-local"
              name="validadeInicio"
              value={formData.validadeInicio}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          {/* ✅ AGORA É DATETIME-LOCAL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Válido até (Data e Hora)
            </label>
            <input
              type="datetime-local"
              name="validadeFim"
              value={formData.validadeFim}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              URL de Afiliado
            </label>
            <input
              type="url"
              name="urlAfiliado"
              value={formData.urlAfiliado}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col justify-center sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                name="destaque"
                checked={formData.destaque}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-magenta focus:ring-brand-magenta"
              />
              Destacar na Home (Cupons Ativos)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <Link
            href="/admin/cupons"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={carregando}
            className="gradient-brand flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {carregando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {carregando ? "Salvando..." : "Salvar Cupom"}
          </button>
        </div>
      </form>
    </div>
  );
}