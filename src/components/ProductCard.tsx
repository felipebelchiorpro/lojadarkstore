
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Zap } from 'lucide-react';
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

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const installmentPrice = (product.price / 3).toFixed(2).replace('.', ',');

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative p-2">
        <Link href={`/products/${product.id}`} passHref className="block aspect-square w-full relative overflow-hidden rounded-md group">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-300 group-hover:scale-105 p-2"
            data-ai-hint="supplement product"
          />
        </Link>
        {hasDiscount && discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
        {product.isNewRelease && !hasDiscount && ( // Show "NOVO!" only if not already showing discount
           <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md flex items-center">
            <Zap className="h-3 w-3 mr-1" /> NOVO!
          </div>
        )}
         {product.isNewRelease && hasDiscount && ( // If both, place "NOVO!" on left
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md flex items-center">
                <Zap className="h-3 w-3 mr-1" /> NOVO!
            </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
        <Link href={`/products/${product.id}`} passHref>
          <h3 className="text-sm font-bold text-foreground leading-tight hover:text-primary transition-colors mb-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto space-y-1.5">
           <div className="flex items-baseline gap-2">
            {hasDiscount && product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className="text-xl font-bold text-destructive">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>3 x de R$ {installmentPrice} sem juros</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 border-t-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold py-3"
          disabled={product.stock === 0}
          aria-label={`Comprar ${product.name}`}
        >
          COMPRAR
        </Button>
      </CardFooter>
    </Card>
  );
}
