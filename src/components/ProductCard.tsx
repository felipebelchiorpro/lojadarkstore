
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Adicionado ao Carrinho!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg bg-card border border-border/40 hover:border-border/70 shadow-none transition-colors duration-300">
      <Link href={`/products/${product.id}`} passHref className="block">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
              data-ai-hint="supplement product"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} passHref>
          <CardTitle className="font-headline text-lg leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="mt-1 text-xs text-muted-foreground">{product.brand}</CardDescription>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-semibold text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
          {product.rating && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/40">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={product.stock === 0}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
        </Button>
      </CardFooter>
    </Card>
  );
}
