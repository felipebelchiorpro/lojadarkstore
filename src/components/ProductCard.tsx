
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card'; // Removed CardHeader, CardTitle, CardDescription
import { ShoppingCart } from 'lucide-react'; // Star removed as it's not in the new design
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
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const installmentPrice = (product.price / 3).toFixed(2).replace('.', ',');

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative p-2">
        <Link href={`/products/${product.id}`} passHref className="block aspect-square w-full relative overflow-hidden rounded-md group">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="contain" // Use contain to ensure full image is visible
            className="transition-transform duration-300 group-hover:scale-105 p-2"
            data-ai-hint="supplement product"
          />
        </Link>
        {hasDiscount && discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <p className="text-xs text-neutral-500 mb-0.5">{product.brand}</p>
        <Link href={`/products/${product.id}`} passHref>
          <h3 className="text-sm font-bold text-neutral-900 leading-tight hover:text-primary transition-colors mb-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto space-y-1.5">
           <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <p className="text-sm text-neutral-400 line-through">
                R$ {product.originalPrice!.toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className="text-xl font-bold text-red-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div className="flex items-center text-xs text-neutral-500">
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
            <span>3 x de R$ {installmentPrice} sem juros</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0 border-t-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-t-none rounded-b-md text-sm font-semibold py-3"
          disabled={product.stock === 0}
          aria-label={`Comprar ${product.name}`}
        >
          COMPRAR
        </Button>
      </CardFooter>
    </Card>
  );
}
