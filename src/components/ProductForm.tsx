"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import type { Product } from "@/types";
import { mockCategories } from "@/data/mockData";
import { useEffect } from "react";

const productSchema = z.object({
  name: z.string().min(3, { message: "Nome do produto deve ter pelo menos 3 caracteres." }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres." }),
  price: z.coerce.number().positive({ message: "Preço deve ser um número positivo." }),
  category: z.string().min(1, { message: "Selecione uma categoria." }),
  brand: z.string().min(2, { message: "Marca deve ter pelo menos 2 caracteres." }),
  imageUrl: z.string().url({ message: "URL da imagem inválida." }).optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0, { message: "Estoque não pode ser negativo." }),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null; // For editing
  onSubmitProduct: (data: Product, isEditing: boolean) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductForm({ product, onSubmitProduct, open, onOpenChange }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      brand: product?.brand || "",
      imageUrl: product?.imageUrl || "https://placehold.co/600x400.png",
      stock: product?.stock || 0,
    },
  });
  
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        imageUrl: product.imageUrl || "https://placehold.co/600x400.png",
        stock: product.stock,
      });
    } else {
      form.reset({ // Default for new product
        name: "",
        description: "",
        price: 0,
        category: "",
        brand: "",
        imageUrl: "https://placehold.co/600x400.png",
        stock: 0,
      });
    }
  }, [product, form, open]);


  const handleSubmit = (data: ProductFormValues) => {
    const finalData: Product = {
      ...data,
      id: product?.id || `prod-${Date.now()}`, // Generate new ID if not editing
      imageUrl: data.imageUrl || "https://placehold.co/600x400.png", // Default placeholder if empty
    };
    onSubmitProduct(finalData, !!product);
    onOpenChange(false); // Close dialog on submit
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card text-card-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            {product ? "Editar Produto" : "Adicionar Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {product ? "Atualize os detalhes do produto." : "Preencha as informações do novo produto."}
          </DialogDescription>
        </DialogHeader>
        {/* Using div as form root for react-hook-form */}
        <div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right col-span-1">Nome</Label>
              <div className="col-span-3">
                <Input id="name" {...form.register("name")} className={form.formState.errors.name ? "border-destructive" : ""} />
                {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right col-span-1 pt-2">Descrição</Label>
              <div className="col-span-3">
                <Textarea id="description" {...form.register("description")} className={form.formState.errors.description ? "border-destructive" : ""} />
                {form.formState.errors.description && <p className="text-xs text-destructive mt-1">{form.formState.errors.description.message}</p>}
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right col-span-1">Preço (R$)</Label>
              <div className="col-span-3">
                <Input id="price" type="number" step="0.01" {...form.register("price")} className={form.formState.errors.price ? "border-destructive" : ""} />
                 {form.formState.errors.price && <p className="text-xs text-destructive mt-1">{form.formState.errors.price.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right col-span-1">Categoria</Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => form.setValue("category", value)} defaultValue={product?.category}>
                  <SelectTrigger className={form.formState.errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && <p className="text-xs text-destructive mt-1">{form.formState.errors.category.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right col-span-1">Marca</Label>
              <div className="col-span-3">
                <Input id="brand" {...form.register("brand")} className={form.formState.errors.brand ? "border-destructive" : ""} />
                {form.formState.errors.brand && <p className="text-xs text-destructive mt-1">{form.formState.errors.brand.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right col-span-1">URL da Imagem</Label>
              <div className="col-span-3">
                <Input id="imageUrl" {...form.register("imageUrl")} className={form.formState.errors.imageUrl ? "border-destructive" : ""} />
                {form.formState.errors.imageUrl && <p className="text-xs text-destructive mt-1">{form.formState.errors.imageUrl.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right col-span-1">Estoque</Label>
              <div className="col-span-3">
                <Input id="stock" type="number" {...form.register("stock")} className={form.formState.errors.stock ? "border-destructive" : ""} />
                {form.formState.errors.stock && <p className="text-xs text-destructive mt-1">{form.formState.errors.stock.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={form.handleSubmit(handleSubmit)} disabled={form.formState.isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {form.formState.isSubmitting ? "Salvando..." : "Salvar Produto"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
