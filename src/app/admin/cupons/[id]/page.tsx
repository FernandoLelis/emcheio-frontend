"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import { cupomService, categoriaService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Categoria } from "@/types";
import { CategoriaModal } from "@/components/admin/CategoriaModal";

const LOJAS_DISPONIVEIS = [
  { value: "Amazon", label: "Amazon" },
  { value: "Mercado Livre", label: "Mercado Livre" },
  { value: "Shopee", label: "Shopee" },
  { value: "Magalu", label: "Magalu" },
  { value: "Outra", label: "Outra" },
];

export default function EditarCupomPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<Categoria[]>([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    loja: "Amazon",
    codigo: "",
    condicoes: "",
    descontoTexto: "",
    urlAfiliado: "",
    validadeInicio: "",
    validadeFim: "",
    destaque: false,
    aplicarEmTodoSite: false,
  });

  useEffect(() => {
    categoriaService.listar().then((data) => {
      const ordenadas = data.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      setCategorias(ordenadas);
    }).catch((err) => console.error("Erro ao buscar categorias:", err));

    cupomService.buscarPorId(id)
      .then((cupom) => {
        const formatarParaInput = (dataString: string | null) => {
          if (!dataString) return "";
          const d = new Date(dataString);
          const ano = d.getFullYear();
          const mes = String(d.getMonth() + 1).padStart(2, "0");
          const dia = String(d.getDate()).padStart(2, "0");
          const hora = String(d.getHours()).padStart(2, "0");
          const minuto = String(d.getMinutes()).padStart(2, "0");
          return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
        };

        setFormData({
          loja: cupom.loja,
          codigo: cupom.codigo,
          condicoes: cupom.condicoes || "",
          descontoTexto: cupom.descontoTexto || "",
          urlAfiliado: cupom.urlAfiliado || "",
          validadeInicio: formatarParaInput(cupom.validadeInicio),
          validadeFim: formatarParaInput(cupom.validadeFim),
          destaque: cupom.destaque,
          aplicarEmTodoSite: cupom.aplicarEmTodoSite || false,
        });

        if (cupom.categorias) {
          setCategoriasSelecionadas(cupom.categorias);
        }
      })
      .catch((error) => {
        setErro("Erro ao carregar os dados do cupom.");
        console.error(error);
      })
      .finally(() => {
        setCarregando(false);
      });

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleCategoria = (categoria: Categoria) => {
    setCategoriasSelecionadas((prev) => {
      const isSelected = prev.some((c) => c.id === categoria.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== categoria.id);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const removerCategoria = (id: number) => {
    setCategoriasSelecionadas((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNovaCategoriaSuccess = (novaCategoria: Categoria) => {
    setCategorias((prev) => 
      [...prev, novaCategoria].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    );
    setCategoriasSelecionadas((prev) => [...prev, novaCategoria]);
    setIsModalCategoriaOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      await cupomService.atualizar(id, {
        loja: formData.loja,
        codigo: formData.codigo,
        condicoes: formData.condicoes || undefined,
        descontoTexto: formData.descontoTexto || undefined,
        urlAfiliado: formData.urlAfiliado || undefined,
        validadeInicio: formData.validadeInicio ? new Date(formData.validadeInicio).toISOString() : undefined,
        validadeFim: formData.validadeFim ? new Date(formData.validadeFim).toISOString() : undefined,
        destaque: formData.destaque,
        aplicarEmTodoSite: formData.aplicarEmTodoSite,
        categoriaIds: formData.aplicarEmTodoSite ? [] : categoriasSelecionadas.map(c => c.id)
      });

      router.push("/admin/cupons");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao atualizar cupom. Tente novamente.");
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/cupons" className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Editar Cupom</h1>
          <p className="text-sm text-text-secondary">Atualize as informações do cupom.</p>
        </div>
      </div>

      {erro && <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">{erro}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Loja *</label>
            <select name="loja" required value={formData.loja} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta">
              {LOJAS_DISPONIVEIS.map((loja) => (
                <option key={loja.value} value={loja.value}>{loja.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Código do Cupom *</label>
            <input type="text" name="codigo" required value={formData.codigo} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 font-mono text-sm uppercase focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Desconto (Texto) *</label>
            <input type="text" name="descontoTexto" required value={formData.descontoTexto} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Regras / Condições do Cupom</label>
            <input type="text" name="condicoes" value={formData.condicoes} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta" />
          </div>

          <div className="sm:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input type="checkbox" name="aplicarEmTodoSite" checked={formData.aplicarEmTodoSite} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-brand-magenta focus:ring-brand-magenta" />
              Aplicar a todos os produtos desta loja (Todo o Site)
            </label>
          </div>

          <div className="relative sm:col-span-2" ref={dropdownRef}>
            <label className="mb-1 block text-sm font-medium text-text-primary">Categorias Específicas (Opcional)</label>
            <p className="mb-2 text-xs text-gray-500">Se não marcar nada e não for "Todo o Site", o cupom não aparecerá na página dos produtos.</p>
            
            <div
              onClick={() => !formData.aplicarEmTodoSite && setDropdownAberto(!dropdownAberto)}
              className={`flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm transition-colors ${
                formData.aplicarEmTodoSite 
                  ? "bg-gray-100 opacity-60 cursor-not-allowed" 
                  : "bg-white cursor-pointer focus-within:border-brand-magenta focus-within:ring-1 focus-within:ring-brand-magenta"
              }`}
            >
              {categoriasSelecionadas.length === 0 ? (
                <span className="text-gray-400">Nenhuma categoria selecionada</span>
              ) : (
                categoriasSelecionadas.map((cat) => (
                  <span key={cat.id} className="flex items-center gap-1 rounded-md bg-brand-magenta/10 px-2 py-1 text-xs font-semibold text-brand-magenta">
                    {cat.nome}
                    {!formData.aplicarEmTodoSite && (
                      <button type="button" onClick={(e) => { e.stopPropagation(); removerCategoria(cat.id); }} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))
              )}
            </div>

            {dropdownAberto && !formData.aplicarEmTodoSite && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {categorias.map((cat) => (
                  <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={categoriasSelecionadas.some((c) => c.id === cat.id)}
                      onChange={() => toggleCategoria(cat)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-magenta focus:ring-brand-magenta"
                    />
                    <span className="text-sm text-text-primary">{cat.nome}</span>
                  </label>
                ))}
                
                <div className="mt-2 border-t border-gray-100 pt-2">
                  <button type="button" onClick={() => setIsModalCategoriaOpen(true)} className="w-full rounded-lg py-2 text-center text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5">
                    + Cadastrar Nova Categoria
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Válido a partir de (Data e Hora)</label>
            <input type="datetime-local" name="validadeInicio" value={formData.validadeInicio} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Válido até (Data e Hora)</label>
            <input type="datetime-local" name="validadeFim" value={formData.validadeFim} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-primary">URL de Afiliado</label>
            <input type="url" name="urlAfiliado" value={formData.urlAfiliado} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta" />
          </div>

          <div className="flex flex-col justify-center sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input type="checkbox" name="destaque" checked={formData.destaque} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-brand-magenta focus:ring-brand-magenta" />
              Destacar na Home (Cupons Ativos)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <Link href="/admin/cupons" className="rounded-xl px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">Cancelar</Link>
          <button type="submit" disabled={salvando} className="gradient-brand flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70">
            {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>

      <CategoriaModal isOpen={isModalCategoriaOpen} onClose={() => setIsModalCategoriaOpen(false)} onSuccess={handleNovaCategoriaSuccess} />
    </div>
  );
}