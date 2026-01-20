"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemDisplay from "@/components/CartItemDisplay";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import CustomerLoginForm from "@/components/CustomerLoginForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CartSheet() {
    const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
    // Safely destructure with fallback if context is initially null (though provider should ensure it exists)
    const { customer } = useCustomerAuth() || {};
    const { toast } = useToast();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [phone, setPhone] = useState('');

    const itemCount = getCartItemCount();
    const total = getCartTotal();

    const handleCheckout = async () => {
        if (!process.env.NEXT_PUBLIC_BASE_URL && typeof window !== 'undefined') {
            // just a safety check
        }

        if (!customer) {
            setShowLogin(true);
            toast({
                title: "Login Necessário",
                description: "Por favor, faça login para finalizar sua compra.",
            });
            return;
        }

        if (!phone) {
            toast({ title: "Telefone obrigatório", description: "Informe seu WhatsApp para contato sobre a retirada.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const { processCheckout } = await import('@/actions/checkout');
            const result = await processCheckout(cartItems, total, phone);

            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                toast({
                    title: "Erro",
                    description: result.message || "Erro ao iniciar pagamento.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Erro inesperado.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 h-14 w-14">
                    <ShoppingBag className="h-10 w-10" />
                    {itemCount > 0 && (
                        <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-600 text-[11px] font-bold text-white flex items-center justify-center border-2 border-background">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-lg bg-card border-l-border">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        Meu Carrinho
                        {itemCount > 0 && (
                            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{itemCount}</span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
                            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                            <p className="text-muted-foreground font-medium">Seu carrinho está vazio</p>
                            <Button variant="outline" onClick={() => setOpen(false)}>Começar a comprar</Button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItemDisplay key={item.id} item={item} compact />
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">WhatsApp para Retirada</label>
                            <input
                                type="tel"
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>

                        <Button
                            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                            onClick={handleCheckout}
                        >
                            {loading ? "Processando..." : (
                                <>
                                    <Image src="https://placehold.co/100x25.png" alt="Mercado Pago" width={80} height={20} className="mr-2 brightness-0 invert" />
                                    Finalizar Compra
                                </>
                            )}
                        </Button>

                        <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-destructive" onClick={clearCart}>
                            Limpar Carrinho
                        </Button>
                    </div>
                )}
            </SheetContent>

            <Dialog open={showLogin} onOpenChange={setShowLogin}>
                <DialogContent className="sm:max-w-md bg-white text-black p-0 border-none overflow-hidden">
                    {/* Pass onSuccess to close the modal after login */}
                    <CustomerLoginForm onSuccess={() => {
                        setShowLogin(false);
                        toast({ title: "Login realizado!", description: "Agora você pode finalizar sua compra.", className: "bg-green-600 text-white" });
                    }} />
                </DialogContent>
            </Dialog>

        </Sheet>
    );
}
