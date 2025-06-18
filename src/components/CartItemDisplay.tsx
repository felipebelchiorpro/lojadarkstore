"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface CartItemDisplayProps {
  item: CartItem;
}

export default function CartItemDisplay({ item }: CartItemDisplayProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };
  
  return (
    <div className="flex items-center space-x-4 py-4 border-b border-border/40">
      <Link href={`/products/${item.id}`} passHref>
        <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-md overflow-hidden bg-muted flex-shrink-0 cursor-pointer">
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="supplement product"
          />
        </div>
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.id}`} passHref>
          <h3 className="text-sm md:text-base font-medium hover:text-primary transition-colors cursor-pointer">{item.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{item.brand}</p>
        <p className="text-sm font-semibold text-primary mt-1">
          R$ {item.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Diminuir quantidade">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          min="1"
          max={item.stock}
          className="h-9 w-12 text-center px-1"
          aria-label={`Quantidade de ${item.name}`}
        />
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label="Aumentar quantidade">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm md:text-base font-semibold w-20 text-right">
        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Remover ${item.name} do carrinho`}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
