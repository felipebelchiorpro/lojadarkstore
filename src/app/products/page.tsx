
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import ProductFilters, { type Filters } from '@/components/ProductFilters';
// import { mockProducts } from '@/data/mockData'; // Removed
import type { Product } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProduct } from '@/context/ProductContext'; // Import useProduct
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { products: allProductsFromContext, loading: productsLoading } = useProduct();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialSearchQuery = searchParams.get('q');

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 1000], // Will be updated once products load
    brands: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    if (!productsLoading && allProductsFromContext.length > 0) {
      const maxPrice = Math.max(...allProductsFromContext.map(p => p.price), 100);
      setFilters(prevFilters => ({
        ...prevFilters,
        priceRange: [0, maxPrice]
      }));
    }
  }, [productsLoading, allProductsFromContext]);

  useEffect(() => {
    if (productsLoading) return;

    let result = [...allProductsFromContext]; // Work with a copy

    // Apply search query
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category));
    }
    if (filters.brands.length > 0) {
      result = result.filter(product => filters.brands.includes(product.brand));
    }
    result = result.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // 'default' or 'popularity' (mocked as default for now)
        // Could add a popularity score to products if needed
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [searchQuery, filters, allProductsFromContext, sortOption, productsLoading]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <Skeleton className="h-96 w-full rounded-lg" />
          </aside>
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold text-foreground">Nossos Produtos</h1>
        <p className="text-lg text-muted-foreground mt-2">Encontre os melhores suplementos para seus objetivos.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <ProductFilters 
            initialFilters={{categories: initialCategory ? [initialCategory] : []}}
            onFilterChange={setFilters} 
          />
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <SearchBar onSearch={setSearchQuery} initialQuery={searchQuery} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Nenhum produto encontrado com os filtros selecionados.</p>
              <p className="text-sm text-muted-foreground mt-2">Tente ajustar sua busca ou filtros.</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} 
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                      isActive={currentPage === page}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} 
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </div>
  );
}
