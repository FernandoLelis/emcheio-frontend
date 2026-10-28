"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { categoriaService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import type { Categoria } from "@/types";
import { MAPA_ICONES, BatomIcon } from "@/components/ui/CategoryIcon";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (categoria: Categoria) => void;
  categoriaParaEditar?: Categoria | null;
}

// ✅ A MÁGICA ACONTECE AQUI: O .sort() no final da array
const ICONES_DISPONIVEIS = [
  { value: "devices", label: "Eletrônicos" },
  { value: "chef-hat", label: "Casa e Cozinha" },
  { value: "shirt", label: "Moda" },
  { value: "gamepad", label: "Games" },
  { value: "tool", label: "Ferramentas" },
  { value: "heart", label: "Saúde" },
  { value: "book", label: "Livros" },
  { value: "ball-football", label: "Esportes" },
  { value: "car", label: "Automotivo" },
  { value: "paw", label: "Pet Shop" },
  { value: "baby-carriage", label: "Infantil" },
  { value: "sofa", label: "Móveis" },
  { value: "music", label: "Música" },
  { value: "gift", label: "Presentes" },
  { value: "briefcase", label: "Escritório" },
  { value: "plant", label: "Jardim" },
  { value: "shoe", label: "Calçados" },
  { value: "clock", label: "Relógios" },
  { value: "lipstick", label: "Beleza" },
].sort((a, b) => a.label.localeCompare(b.label, "pt-BR")); // ✅ Ordena alfabeticamente pelo 'label'

export function CategoriaModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  categoriaParaEditar 
}: CategoriaModalProps) {
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [icone, setIcone] = useState("devices");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const isEditing = !!categoriaParaEditar;

  useEffect(() => {
    if (isOpen) {
      if (categoriaParaEditar) {
        setNome(categoriaParaEditar.nome);
        setSlug(categoriaParaEditar.slug);
        setIcone(categoriaParaEditar.icone || "devices");
      } else {
        setNome("");
        setSlug("");
        setIcone("devices");
      }
      setErro("");
    }
  }, [isOpen, categoriaParaEditar]);

  if (!isOpen) return null;

  const gerarSlug = () => {
    const s = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      let categoriaSalva: Categoria;

      if (isEditing && categoriaParaEditar) {
        categoriaSalva = await categoriaService.atualizar(categoriaParaEditar.id, {
          nome,
          slug,
          icone,
        });
      } else {
        categoriaSalva = await categoriaService.criar({
          nome,
          slug,
          icone,
        });
      }

      onSuccess(categoriaSalva);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro("Erro ao salvar categoria. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const IconePreview = icone === "lipstick" ? null : MAPA_ICONES[icone];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-text-primary">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-text-secondary hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Nome da Categoria *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                  placeholder="Ex: Saúde"
                />
                <button
                  type="button"
                  onClick={gerarSlug}
                  className="whitespace-nowrap rounded-xl bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                >
                  Gerar Slug
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                placeholder="Ex: saude"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Ícone Representativo
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={icone}
                  onChange={(e) => setIcone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                >
                  {ICONES_DISPONIVEIS.map((ic) => (
                    <option key={ic.value} value={ic.value}>
                      {ic.label}
                    </option>
                  ))}
                </select>
                
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50">
                  {icone === "lipstick" ? (
                    <BatomIcon className="h-6 w-6 text-brand-magenta" />
                  ) : IconePreview ? (
                    <IconePreview className="h-6 w-6 text-brand-magenta" stroke={1.5} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="gradient-brand flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-bold text-white hover:scale-[1.02] disabled:opacity-70"
            >
              {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {carregando ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Categoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}