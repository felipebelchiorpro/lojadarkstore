
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Save, XCircle, Edit, PackageSearch, AlertTriangleIcon } from "lucide-react";
import { useProduct } from '@/context/ProductContext';
import { Skeleton } from '@/components/ui/skeleton';

interface EditFormData {
  price: string;
  stock: string;
}

export default function QuickEditPage() {
  const { products: contextProducts, updateProduct: contextUpdateProduct, loading: productsLoading } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({ price: '', stock: '' });

  // Local state to manage products for this page, initialized from context
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!productsLoading) {
      setLocalProducts(contextProducts.map(p => ({...p}))); // Create a shallow copy for local modifications before saving to context
    }
  }, [contextProducts, productsLoading]);


  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditFormData({
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
  };

  const handleCancel = () => {
    setEditingProductId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (productId: string) => {
    const productToUpdate = localProducts.find(p => p.id === productId);
    if (!productToUpdate) return;

    const priceNum = parseFloat(editFormData.price);
    const stockNum = parseInt(editFormData.stock, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      toast({ title: "Erro", description: "Preço inválido.", variant: "destructive" });
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast({ title: "Erro", description: "Estoque inválido.", variant: "destructive" });
      return;
    }

    const updatedProduct = { ...productToUpdate, price: priceNum, stock: stockNum };
    contextUpdateProduct(updatedProduct); // Update in context
    setLocalProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p)); // Update local copy

    toast({ title: "Salvo!", description: `${updatedProduct.name} atualizado com sucesso.` });
    setEditingProductId(null);
  };

  const filteredProducts = useMemo(() => localProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.name.localeCompare(b.name)), [localProducts, searchTerm]);

  if (productsLoading) {
     return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <div className="bg-card p-0 rounded-lg shadow-md overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border-b">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-20 ml-auto" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold text-foreground">Edição Rápida de Produtos</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
        <div className="relative w-full sm:max-w-md">
          <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar produtos por nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card p-0 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Imagem</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="w-[150px] text-right">Preço Venda (R$)</TableHead>
              <TableHead className="w-[120px] text-center">Estoque</TableHead>
              <TableHead className="w-[200px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TableRow key={product.id} className={editingProductId === product.id ? 'bg-muted/60' : ''}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                    <Image src={product.imageUrl || "https://placehold.co/600x400.png"} alt={product.name} layout="fill" objectFit="cover" data-ai-hint="supplement product" />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                </TableCell>
                <TableCell className="text-right">
                  {editingProductId === product.id ? (
                    <Input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleInputChange}
                      className="h-9 w-28 text-right ml-auto"
                      step="0.01"
                    />
                  ) : (
                    <span className="font-semibold text-primary">
                      {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editingProductId === product.id ? (
                    <Input
                      type="number"
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleInputChange}
                      className="h-9 w-20 text-center mx-auto"
                    />
                  ) : (
                    <span className={`font-semibold text-sm ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                       {product.stock < 10 && <AlertTriangleIcon className="inline h-4 w-4 mr-1 mb-0.5" />}
                      {product.stock}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editingProductId === product.id ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleSave(product.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="mr-1.5 h-4 w-4" /> Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" /> Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit className="mr-1.5 h-4 w-4" /> Editar Preço/Estoque
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )) : (
               <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum produto encontrado com o termo pesquisado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
