"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockProducts } from '@/data/mockData';
import type { Product, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Star, ShoppingCart, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format dates (can be moved to a utils file)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === params.id);
    // Simulate API delay
    setTimeout(() => {
      setProduct(foundProduct || null);
    }, 300);
  }, [params.id]);

  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Adicionado ao Carrinho!",
      description: `${quantity}x ${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : product.rating || 0;

  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para produtos
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="sticky top-24">
          <div className="aspect-square w-full relative overflow-hidden rounded-lg shadow-lg bg-card">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="contain"
              className="p-4"
              data-ai-hint="supplement product"
            />
          </div>
          {/* Thumbnail images can be added here if multiple images per product */}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
          <p className="text-sm text-muted-foreground">Marca: <span className="text-foreground">{product.brand}</span> | Categoria: <span className="text-foreground">{product.category}</span></p>
          
          {averageRating > 0 && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({product.reviews?.length || 0} avaliações)</span>
            </div>
          )}

          <p className="text-3xl font-semibold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          
          <div className="flex items-center space-x-3">
            <label htmlFor="quantity" className="text-sm font-medium">Quantidade:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock > 0 ? product.stock : 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-center"
              disabled={product.stock === 0}
            />
             {product.stock > 0 && <span className="text-xs text-muted-foreground">({product.stock} em estoque)</span>}
          </div>

          <Button 
            size="lg" 
            onClick={handleAddToCart} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
          </Button>
          
          {product.stock === 0 && <p className="text-destructive text-sm text-center">Produto indisponível no momento.</p>}

          <div className="flex items-center text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
            <span>Compra segura e entrega garantida.</span>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Product Information Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 mb-6">
          <TabsTrigger value="description" className="text-base py-2.5">Descrição</TabsTrigger>
          <TabsTrigger value="reviews" className="text-base py-2.5">Avaliações ({product.reviews?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="prose prose-invert max-w-none p-4 bg-card rounded-lg shadow">
          <p>{product.description}</p>
          {/* Add more detailed description if available */}
        </TabsContent>
        <TabsContent value="reviews" className="p-4 bg-card rounded-lg shadow">
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review: Review) => (
                <div key={review.id} className="border-b border-border/40 pb-4 last:border-b-0">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground">{formatDate(review.date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Ainda não há avaliações para este produto.</p>
          )}
          {/* Add review submission form here if desired */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
