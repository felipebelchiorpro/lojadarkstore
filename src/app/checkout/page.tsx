"use client";

import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { processCheckout } from "@/actions/checkout";
import { Loader2, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
    const { cartItems: cart, getCartTotal } = useCart();
    const { customer, isCustomerAuthenticated } = useCustomerAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (isCustomerAuthenticated && customer) {
            setName(customer.name || "");
            setEmail(customer.email || "");
            setPhone(customer.phone || "");
        }
    }, [isCustomerAuthenticated, customer]);

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast({ title: "Carrinho Vazio", description: "Adicione produtos antes de finalizar.", variant: "destructive" });
            return;
        }

        if (!name || !email || !phone) {
            toast({ title: "Dados Incompletos", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
            return;
        }

        setLoading(true);

        try {
            const result = await processCheckout(cart, getCartTotal(), phone);

            if (result.success && result.url) {
                window.location.href = result.url; // Redirect to Mercado Pago
            } else {
                toast({
                    title: "Erro no Pagamento",
                    description: result.message || "Não foi possível iniciar o pagamento.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Ocorreu um erro inesperado.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Seu Carrinho está vazio</h1>
                <p className="text-muted-foreground mb-6">Parece que você ainda não adicionou nenhum suplemento.</p>
                <Link href="/products">
                    <Button>Ver Produtos</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="font-headline text-3xl font-bold mb-8 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" /> Finalizar Compra
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Identificação & Payment Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Section 1: Identification */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Identificação</CardTitle>
                            <CardDescription>Precisamos dos seus dados para o pedido na DarkStore.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isCustomerAuthenticated && (
                                <div className="bg-muted p-4 rounded-md mb-4 flex justify-between items-center">
                                    <span className="text-sm">Já tem cadastro?</span>
                                    <Link href={`/account/login?redirect=/checkout`}>
                                        <Button variant="outline" size="sm">Fazer Login</Button>
                                    </Link>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu Nome"
                                        disabled={isCustomerAuthenticated && !!customer?.name} // Lock if coming from auth? Optional.
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        disabled={isCustomerAuthenticated}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: Payment (Preview) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Pagamento</CardTitle>
                            <CardDescription>O pagamento será processado de forma segura pelo <strong>Mercado Pago</strong>.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 py-4">
                                <Image src="https://logopng.com.br/logos/mercado-pago-21.png" alt="Mercado Pago" width={100} height={40} className="object-contain" />
                                <div className="text-sm text-muted-foreground">
                                    Você será redirecionado para o Mercado Pago para concluir o pagamento com Cartão de Crédito, PIX ou Boleto.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div>
                                            <p className="font-medium line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold whitespace-nowrap">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price) * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getCartTotal())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Frete</span>
                                    <span className="text-green-500">Grátis</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold mt-2">
                                    <span>Total</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getCartTotal())}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20" onClick={handleCheckout} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
                                    </>
                                ) : (
                                    <>
                                        Pagar com Mercado Pago <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
