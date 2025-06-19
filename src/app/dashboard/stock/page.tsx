
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, PackageSearch, AlertTriangle } from "lucide-react";
import { useProduct } from '@/context/ProductContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function StockManagementPage() {
  const { products: contextProducts, updateProduct: contextUpdateProduct, loading: productsLoading } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Local state to manage products for this page, including currentEditStock
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!productsLoading) {
      // Initialize currentEditStock for each product when contextProducts are loaded/changed
      setLocalProducts(contextProducts.map(p => ({ ...p, currentEditStock: p.stock })));
    }
  }, [contextProducts, productsLoading]);


  const handleStockChange = (productId: string, newStock: string) => {
    const stockValue = parseInt(newStock);
    setLocalProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, currentEditStock: isNaN(stockValue) ? 0 : stockValue } : p))
    );
  };

  const handleUpdateStock = (productId: string) => {
    const productToUpdateLocally = localProducts.find(p => p.id === productId);
    if (productToUpdateLocally && productToUpdateLocally.currentEditStock !== undefined) {
      const updatedProductForContext: Product = { 
        ...productToUpdateLocally, 
        stock: productToUpdateLocally.currentEditStock 
      };
      // Remove transient property before sending to context
      delete updatedProductForContext.currentEditStock; 
      
      contextUpdateProduct(updatedProductForContext);

      // Update local state to reflect the committed stock and reset currentEditStock
      setLocalProducts(prev =>
        prev.map(p => (p.id === productId ? { ...updatedProductForContext, currentEditStock: updatedProductForContext.stock } : p))
      );
      
      toast({
        title: "Estoque Atualizado!",
        description: `Estoque de ${updatedProductForContext.name} atualizado para ${updatedProductForContext.stock}.`,
      });
    }
  };

  const filteredProducts = useMemo(() => localProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.stock - b.stock), [localProducts, searchTerm]);


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
      <h1 className="font-headline text-3xl font-bold text-foreground">Controle de Estoque</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
        <div className="relative w-full sm:max-w-md">
          <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
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
              <TableHead className="w-[120px] text-center">Estoque Atual</TableHead>
              <TableHead className="w-[180px] text-center">Novo Estoque</TableHead>
              <TableHead className="w-[120px] text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TableRow key={product.id} className={product.stock < 10 ? 'bg-red-500/10 hover:bg-red-500/20' : ''}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                    <Image src={product.imageUrl || "https://placehold.co/600x400.png"} alt={product.name} layout="fill" objectFit="cover" data-ai-hint="supplement product" />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand} / {product.category}</p>
                </TableCell>
                <TableCell className={`text-center font-semibold text-sm ${product.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {product.stock < 10 && <AlertTriangle className="inline h-4 w-4 mr-1 mb-0.5" />}
                  {product.stock}
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={product.currentEditStock ?? product.stock} // Use currentEditStock, fallback to stock
                    onChange={(e) => handleStockChange(product.id, e.target.value)}
                    className="h-9 w-24 text-center mx-auto"
                    min="0"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStock(product.id)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    disabled={product.currentEditStock === product.stock || product.currentEditStock === undefined || isNaN(Number(product.currentEditStock))}
                  >
                    <RefreshCw className="mr-2 h-3 w-3" /> Atualizar
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
               <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
