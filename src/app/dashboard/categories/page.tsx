
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Category } from "@/types";
import { fetchCategoriesService, createCategoryService, updateCategoryService, deleteCategoryService } from "@/services/categoryService";
import CategoryForm from "@/components/CategoryForm";
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await fetchCategoriesService();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategoryService(deleteId);
      toast({ title: "Categoria removida com sucesso!" });
      loadCategories();
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleFormSubmit = async (data: Category) => {
    try {
      if (editingCategory) {
        // Update
        await updateCategoryService({ ...editingCategory, ...data });
        toast({ title: "Categoria atualizada!" });
      } else {
        // Create
        await createCategoryService(data);
        toast({ title: "Categoria criada!" });
      }
      loadCategories();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias da sua loja.</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorias..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">IMG</div>
                      )}

                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={editingCategory}
        onSubmitCategory={handleFormSubmit}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente a categoria
              e pode afetar produtos vinculados a ela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
