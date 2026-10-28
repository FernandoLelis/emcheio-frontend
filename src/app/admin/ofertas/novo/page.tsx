"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ofertaService, produtoService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Produto } from "@/types";

// Lista fixa de lojas para manter o padrão do StoreLogo
const LOJAS_DISPONIVEIS = [
  { value: "Amazon", label: "Amazon" },
  { value: "Mercado Livre", label: "Mercado Livre" },
  { value: "Shopee", label: "Shopee" },
  { value: "Magalu", label: "Magalu" },
  { value: "Nike", label: "Nike" },
  { value: "Outra", label: "Outra" },
];

export default function NovaOfertaPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    produtoId: "",
    loja: "Amazon",
    precoAtual: "",
    precoOriginal: "",
    urlAfiliado: "",
    disponivel: true,
    destaque: false,
  });

  // Busca os produtos para o select
  useEffect(() => {
    produtoService
      .listar()
      .then((data) => {
        // Ordena alfabeticamente por nome
        const ordenados = data.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        setProdutos(ordenados);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

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
      await ofertaService.criar({
        produtoId: Number(formData.produtoId),
        loja: formData.loja,
        precoAtual: Number(formData.precoAtual),
        precoOriginal: formData.precoOriginal
          ? Number(formData.precoOriginal)
          : undefined,
        urlAfiliado: formData.urlAfiliado,
        disponivel: formData.disponivel,
        destaque: formData.destaque,
      });

      router.push("/admin/ofertas");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao cadastrar oferta. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/ofertas"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Nova Oferta</h1>
          <p className="text-sm text-text-secondary">
            Cadastre um novo preço e link de afiliado.
          </p>
        </div>
      </div>

      {erro && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Produto */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Produto *
            </label>
            <select
              name="produtoId"
              required
              value={formData.produtoId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            >
              <option value="">Selecione um produto</option>
              {produtos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Loja */}
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

          {/* URL de Afiliado */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              URL de Afiliado *
            </label>
            <input
              type="url"
              name="urlAfiliado"
              required
              value={formData.urlAfiliado}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="https://..."
            />
          </div>

          {/* Preço Atual */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Preço Atual (R$) *
            </label>
            <input
              type="number"
              name="precoAtual"
              required
              step="0.01"
              min="0"
              value={formData.precoAtual}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="Ex: 2299.00"
            />
          </div>

          {/* Preço Original */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Preço Original (R$)
            </label>
            <input
              type="number"
              name="precoOriginal"
              step="0.01"
              min="0"
              value={formData.precoOriginal}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              placeholder="Ex: 3999.00 (Opcional)"
            />
          </div>

          {/* Checkboxes (Disponível / Destaque) */}
          <div className="flex flex-col justify-center gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:gap-8">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                name="disponivel"
                checked={formData.disponivel}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-magenta focus:ring-brand-magenta"
              />
              Produto Disponível
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                name="destaque"
                checked={formData.destaque}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-magenta focus:ring-brand-magenta"
              />
              Destacar na Home
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <Link
            href="/admin/ofertas"
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
            {carregando ? "Salvando..." : "Salvar Oferta"}
          </button>
        </div>
      </form>
    </div>
  );
}