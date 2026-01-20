
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrand } from '@/context/BrandContext';
import { PlusCircle, Tag, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageBrandsPage() {
  const { brands, addBrand, getBrands } = useBrand();
  const [newBrandName, setNewBrandName] = useState("");
  const { toast } = useToast(); // If BrandContext handles toasts, this might not be needed here directly

  const currentBrands = getBrands(); // Get sorted brands

  const handleAddBrand = () => {
    if (newBrandName.trim()) {
      addBrand(newBrandName.trim()); // addBrand in context now shows toasts
      setNewBrandName(""); // Clear input after adding
    } else {
      toast({ title: "Erro", description: "O nome da marca não pode ser vazio.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-foreground flex items-center">
        <Tag className="mr-3 h-8 w-8 text-primary" /> Gerenciar Marcas
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Adicionar Nova Marca</CardTitle>
          <CardDescription>Insira o nome da nova marca para adicioná-la ao sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Nome da nova marca"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddBrand();}}
              className="flex-grow"
            />
            <Button onClick={handleAddBrand} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Marca
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><List className="mr-2 h-6 w-6 text-primary"/> Marcas Cadastradas</CardTitle>
          <CardDescription>Lista de todas as marcas disponíveis no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {currentBrands.length > 0 ? (
            <ul className="space-y-2">
              {currentBrands.map((brand, index) => (
                <li key={index} className="p-3 bg-muted/50 rounded-md text-sm text-foreground border border-border/30">
                  {brand}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhuma marca cadastrada ainda.</p>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                Total de marcas: {currentBrands.length}
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
