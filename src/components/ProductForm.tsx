
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import type { Product } from "@/types";
import { mockCategories } from "@/data/mockData"; 
import { useBrand } from "@/context/BrandContext"; // Import useBrand
import { useEffect, useState } from "react";
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, { message: "Nome do produto deve ter pelo menos 3 caracteres." }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres." }),
  price: z.coerce.number().positive({ message: "Preço de venda deve ser um número positivo." }),
  originalPrice: z.coerce.number().positive({ message: "Preço original deve ser um número positivo." }).optional().nullable(),
  category: z.string().min(1, { message: "Selecione uma categoria." }),
  brand: z.string().min(1, { message: "Selecione uma marca." }),
  imageUrl: z.string().min(1, { message: "É necessário uma imagem." }),
  stock: z.coerce.number().int().min(0, { message: "Estoque não pode ser negativo." }),
  isNewRelease: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null; 
  onSubmitProduct: (data: Product, isEditing: boolean) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_PLACEHOLDER_IMAGE = "https://placehold.co/600x400.png";

export default function ProductForm({ product, onSubmitProduct, open, onOpenChange }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { getBrands } = useBrand(); // Use the BrandContext
  const availableBrands = getBrands(); // Get brands from context

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: null,
      category: "",
      brand: "",
      imageUrl: DEFAULT_PLACEHOLDER_IMAGE,
      stock: 0,
      isNewRelease: false,
    },
  });
  
  useEffect(() => {
    if (open) { 
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || null,
          category: product.category,
          brand: product.brand,
          imageUrl: product.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
          stock: product.stock,
          isNewRelease: product.isNewRelease || false,
        });
        setImagePreview(product.imageUrl || DEFAULT_PLACEHOLDER_IMAGE);
      } else {
        form.reset({ 
          name: "",
          description: "",
          price: 0,
          originalPrice: null,
          category: "",
          brand: "",
          imageUrl: DEFAULT_PLACEHOLDER_IMAGE,
          stock: 0,
          isNewRelease: false,
        });
        setImagePreview(DEFAULT_PLACEHOLDER_IMAGE); 
      }
    }
  }, [product, form, open]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        form.setValue("imageUrl", dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      const revertUrl = product?.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;
      setImagePreview(revertUrl);
      form.setValue("imageUrl", revertUrl);
    }
  };

  const handleSubmit = (data: ProductFormValues) => {
    const finalData: Product = {
      ...data,
      id: product?.id || `prod-${Date.now()}`, 
      imageUrl: data.imageUrl,
      originalPrice: data.originalPrice || undefined, 
      isNewRelease: data.isNewRelease || false,
    };
    onSubmitProduct(finalData, !!product);
    onOpenChange(false); 
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
              <Label htmlFor="originalPrice" className="text-right col-span-1">Preço Original (R$)</Label>
              <div className="col-span-3">
                <Input id="originalPrice" type="number" step="0.01" {...form.register("originalPrice")} placeholder="Opcional" className={form.formState.errors.originalPrice ? "border-destructive" : ""} />
                 {form.formState.errors.originalPrice && <p className="text-xs text-destructive mt-1">{form.formState.errors.originalPrice.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right col-span-1">Preço Venda (R$)</Label>
              <div className="col-span-3">
                <Input id="price" type="number" step="0.01" {...form.register("price")} className={form.formState.errors.price ? "border-destructive" : ""} />
                 {form.formState.errors.price && <p className="text-xs text-destructive mt-1">{form.formState.errors.price.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right col-span-1">Categoria</Label>
              <div className="col-span-3">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className={form.formState.errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category && <p className="text-xs text-destructive mt-1">{form.formState.errors.category.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right col-span-1">Marca</Label>
              <div className="col-span-3">
                 <Controller
                    name="brand"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger className={form.formState.errors.brand ? "border-destructive" : ""}>
                            <SelectValue placeholder="Selecione uma marca" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableBrands.length > 0 ? (
                              availableBrands.map(brandName => (
                                <SelectItem key={brandName} value={brandName}>{brandName}</SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>Nenhuma marca cadastrada</SelectItem>
                            )}
                        </SelectContent>
                        </Select>
                    )}
                 />
                {form.formState.errors.brand && <p className="text-xs text-destructive mt-1">{form.formState.errors.brand.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="imageUpload" className="text-right col-span-1 pt-2">Imagem</Label>
              <div className="col-span-3">
                <Input 
                  id="imageUpload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className={form.formState.errors.imageUrl ? "border-destructive" : ""} 
                />
                {imagePreview && (
                  <div className="mt-2 relative w-32 h-32 rounded border border-muted overflow-hidden bg-muted">
                    <Image src={imagePreview} alt="Pré-visualização do produto" layout="fill" objectFit="contain" data-ai-hint="product preview"/>
                  </div>
                )}
                {form.formState.errors.imageUrl && !imagePreview && (
                   <p className="text-xs text-destructive mt-1">{form.formState.errors.imageUrl.message}</p>
                )}
                <input type="hidden" {...form.register("imageUrl")} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right col-span-1">Estoque</Label>
              <div className="col-span-3">
                <Input id="stock" type="number" {...form.register("stock")} className={form.formState.errors.stock ? "border-destructive" : ""} />
                {form.formState.errors.stock && <p className="text-xs text-destructive mt-1">{form.formState.errors.stock.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isNewRelease" className="text-right col-span-1">Lançamento?</Label>
                <div className="col-span-3 flex items-center">
                    <Controller
                        name="isNewRelease"
                        control={form.control}
                        render={({ field }) => (
                            <Checkbox
                                id="isNewRelease"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                            />
                        )}
                    />
                    <Label htmlFor="isNewRelease" className="font-normal">Marcar como novo lançamento</Label>
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
