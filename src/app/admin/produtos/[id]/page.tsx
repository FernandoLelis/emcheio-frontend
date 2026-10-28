"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { produtoService, categoriaService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Categoria } from "@/types";
import { CategoriaModal } from "@/components/admin/CategoriaModal";

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    slug: "",
    descricao: "",
    marca: "",
    imagemUrl: "",
    categoriaId: "",
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [cats, produto] = await Promise.all([
          categoriaService.listar(),
          produtoService.buscarPorId(id),
        ]);

        // ✅ Garante ordenação alfabética correta em português
        const categoriasOrdenadas = cats.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        setCategorias(categoriasOrdenadas);
        
        setFormData({
          nome: produto.nome,
          slug: produto.slug,
          descricao: produto.descricao || "",
          marca: produto.marca || "",
          imagemUrl: produto.imagemUrl || "",
          categoriaId: produto.categoriaId ? String(produto.categoriaId) : "",
        });
      } catch (error) {
        setErro("Erro ao carregar os dados do produto.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarDados();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === "nova") {
      setIsModalCategoriaOpen(true);
      e.target.value = formData.categoriaId;
      return;
    }

    setFormData((prev) => ({ ...prev, categoriaId: value }));
  };

  const handleNovaCategoriaSuccess = (novaCategoria: Categoria) => {
    // ✅ Adiciona e ordena a lista com a nova categoria
    setCategorias((prev) => 
      [...prev, novaCategoria].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    );
    setFormData((prev) => ({ ...prev, categoriaId: String(novaCategoria.id) }));
  };

  const gerarSlug = () => {
    const slug = formData.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      await produtoService.atualizar(id, {
        nome: formData.nome,
        slug: formData.slug,
        descricao: formData.descricao || undefined,
        marca: formData.marca || undefined,
        imagemUrl: formData.imagemUrl || undefined,
        categoriaId: formData.categoriaId
          ? Number(formData.categoriaId)
          : undefined,
      });

      router.push("/admin/produtos");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao atualizar produto. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-magenta" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produtos"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Editar Produto</h1>
          <p className="text-sm text-text-secondary">
            Atualize as informações do item.
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
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Nome do Produto *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              />
              <button
                type="button"
                onClick={gerarSlug}
                className="whitespace-nowrap rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Gerar Slug
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Categoria
            </label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleCategoriaChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            >
              <option value="">Sem categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
              <option value="nova" className="font-bold text-brand-magenta">
                + Cadastrar Nova Categoria
              </option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              URL da Imagem
            </label>
            <input
              type="url"
              name="imagemUrl"
              value={formData.imagemUrl}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Descrição
            </label>
            <textarea
              name="descricao"
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <Link
            href="/admin/produtos"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className="gradient-brand flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {salvando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>

      <CategoriaModal
        isOpen={isModalCategoriaOpen}
        onClose={() => setIsModalCategoriaOpen(false)}
        onSuccess={handleNovaCategoriaSuccess}
      />
    </div>
  );
}