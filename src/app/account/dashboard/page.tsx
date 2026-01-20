
"use client";

import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerDashboardPage() {
  const { customer, isCustomerAuthenticated, customerAuthLoading, customerLogout } = useCustomerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!customerAuthLoading && !isCustomerAuthenticated) {
      router.replace('/account/login?redirect=/account/dashboard');
    }
  }, [isCustomerAuthenticated, customerAuthLoading, router]);

  if (customerAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-lg text-foreground">Carregando sua área...</p>
      </div>
    );
  }

  if (!isCustomerAuthenticated || !customer) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-lg text-foreground">Redirecionando para login...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
          Bem-vindo(a), {customer.name || 'Cliente'}!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">Esta é a sua área de cliente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <CardTitle>Meus Pedidos</CardTitle>
            </div>
            <CardDescription>Acompanhe e visualize seu histórico.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock Empty State */}
            <div className="text-center py-4 bg-muted/20 rounded-md">
              <p className="text-sm font-medium">Você ainda não fez pedidos.</p>
              <Button variant="link" className="text-primary mt-2 h-auto p-0" onClick={() => router.push('/products')}>
                Começar a comprar &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <CardTitle>Meus Endereços</CardTitle>
            </div>
            <CardDescription>Gerencie seus locais de entrega.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <p className="text-sm font-semibold">Casa</p>
                <p className="text-xs text-muted-foreground truncate">Rua Exemplo, 123 - Centro</p>
              </div>
              <Button variant="outline" className="w-full text-xs h-8">Adicionar Novo Endereço</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <CardTitle>Dados Pessoais</CardTitle>
            </div>
            <CardDescription>Mantenha seus dados atualizados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Nome</p>
              <p className="text-sm font-medium">{customer.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Email</p>
              <p className="text-sm font-medium break-all">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Telefone</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80 mt-2 h-8">
              Editar Dados
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={customerLogout}>
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
