
"use client";

import type { Brand } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BrandContextType {
  brands: Brand[];
  addBrand: (brandName: string) => void;
  getBrands: () => Brand[];
  // removeBrand might be added later if needed
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const BRAND_STORAGE_KEY = 'darkstore-brands';

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBrands = localStorage.getItem(BRAND_STORAGE_KEY);
      if (storedBrands) {
        setBrands(JSON.parse(storedBrands));
      } else {
        // Initialize with some default brands if none are stored
        const initialBrands = ["Dark Nutrition", "Dark Vitality", "Dark Performance"];
        setBrands(initialBrands);
        persistBrands(initialBrands);
      }
    } catch (error) {
      console.error("Failed to parse brands from localStorage", error);
      localStorage.removeItem(BRAND_STORAGE_KEY);
    }
  }, []);

  const persistBrands = useCallback((updatedBrands: Brand[]) => {
    try {
      localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(updatedBrands));
    } catch (error) {
      console.error("Failed to save brands to localStorage", error);
    }
  }, []);

  const addBrand = (brandName: string) => {
    if (!brandName.trim()) {
      toast({ title: "Erro", description: "Nome da marca não pode ser vazio.", variant: "destructive" });
      return;
    }
    setBrands(prevBrands => {
      const normalizedNewBrand = brandName.trim();
      const brandExists = prevBrands.some(
        b => b.toLowerCase() === normalizedNewBrand.toLowerCase()
      );

      if (brandExists) {
        toast({ title: "Marca Existente", description: `A marca "${normalizedNewBrand}" já existe.`, variant: "default" });
        return prevBrands;
      }
      const newBrands = [...prevBrands, normalizedNewBrand].sort((a, b) => a.localeCompare(b));
      persistBrands(newBrands);
      toast({ title: "Marca Adicionada", description: `Marca "${normalizedNewBrand}" adicionada com sucesso.` });
      return newBrands;
    });
  };

  const getBrands = useCallback(() => {
    return [...brands].sort((a, b) => a.localeCompare(b));
  }, [brands]);

  return (
    <BrandContext.Provider value={{ brands, addBrand, getBrands }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
