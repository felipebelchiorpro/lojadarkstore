"use client";

import { useCart } from '@/context/CartContext';
import CartItemDisplay from '@/components/CartItemDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();
  // Simulate shipping - could be more complex
  const shippingCost = cartTotal > 199 || cartTotal === 0 ? 0 : 25.00; 
  const finalTotal = cartTotal + shippingCost;

  const handleCheckout = () => {
    // In a real app, this would redirect to a checkout flow or payment gateway
    toast({
      title: "Pedido Simulado!",
      description: "Seu pedido foi 'finalizado' com sucesso. (Simulação)",
    });
    // Potentially clear cart after "checkout" or redirect to an order confirmation page
    // clearCart(); 
    // router.push('/order-confirmation'); // if such page exists
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrinho Limpo!",
      description: "Todos os itens foram removidos do seu carrinho.",
      variant: "default" 
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold text-foreground">Seu Carrinho</h1>
        {itemCount > 0 ? (
          <p className="text-lg text-muted-foreground mt-2">
            Você tem {itemCount} item(ns) no seu carrinho.
          </p>
        ) : null}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg shadow-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Seu carrinho está vazio.</h2>
          <p className="text-muted-foreground mb-6">Adicione produtos ao seu carrinho para vê-los aqui.</p>
          <Link href="/products" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Explorar Produtos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/40">
              <h2 className="text-xl font-semibold">Itens do Carrinho</h2>
              <Button variant="outline" onClick={handleClearCart} className="text-sm text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="mr-2 h-4 w-4" /> Limpar Carrinho
              </Button>
            </div>
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItemDisplay key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({itemCount} itens):</span>
                  <span className="text-foreground font-medium">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete:</span>
                  <span className="text-foreground font-medium">
                    {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {shippingCost > 0 && cartTotal <= 199 && (
                     <p className="text-xs text-green-500 text-center">Frete grátis para compras acima de R$ 199,00!</p>
                )}
                <hr className="my-2 border-border/40" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleCheckout}>
                  <CreditCard className="mr-2 h-5 w-5" /> Finalizar Compra (Simulado)
                </Button>
                <Link href="/products" className="w-full" passHref>
                  <Button variant="outline" size="lg" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
