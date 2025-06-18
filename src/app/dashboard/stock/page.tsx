"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { mockProducts as initialProducts } from "@/data/mockData";
import type { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, PackageSearch, AlertTriangle } from "lucide-react";

export default function StockManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts.map(p => ({ ...p, currentEditStock: p.stock })));
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Effect to update currentEditStock if products prop changes (e.g. after an edit from product management page)
  // For this mock, initialProducts don't change, but this is good practice.
  useEffect(() => {
     setProducts(initialProducts.map(p => ({ ...p, currentEditStock: p.stock })));
  }, []);


  const handleStockChange = (productId: string, newStock: string) => {
    const stockValue = parseInt(newStock);
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, currentEditStock: isNaN(stockValue) ? 0 : stockValue } : p))
    );
  };

  const handleUpdateStock = (productId: string) => {
    const productToUpdate = products.find(p => p.id === productId);
    if (productToUpdate) {
      // Simulate API call & update state
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, stock: p.currentEditStock ?? p.stock } : p))
      );
      toast({
        title: "Estoque Atualizado!",
        description: `Estoque de ${productToUpdate.name} atualizado para ${productToUpdate.currentEditStock}.`,
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.stock - b.stock); // Sort by stock, lowest first

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
        {/* Could add filters for stock levels (e.g., low stock, out of stock) */}
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
                    <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" data-ai-hint="supplement product" />
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
                    value={product.currentEditStock ?? product.stock}
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
                    disabled={product.currentEditStock === product.stock || product.currentEditStock === undefined}
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
