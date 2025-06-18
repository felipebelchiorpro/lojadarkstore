"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, mockProducts } from "@/data/mockData";
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';


const chartData = mockOrders.reduce((acc, order) => {
  const month = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
  const existingMonth = acc.find(item => item.month === month);
  if (existingMonth) {
    existingMonth.total += order.totalAmount;
  } else {
    acc.push({ month, total: order.totalAmount });
  }
  return acc;
}, [] as { month: string; total: number }[]).sort((a,b) => new Date(`01 ${a.month} 2000`) > new Date(`01 ${b.month} 2000`) ? 1 : -1); // Basic sort by month


export default function DashboardPage() {
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = mockOrders.length;
  const totalProducts = mockProducts.length;
  // Simulate low stock items
  const lowStockItems = mockProducts.filter(p => p.stock < 10).length;

  const summaryCards = [
    { title: "Receita Total", value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, icon: DollarSign, link: "/dashboard/sales", color: "text-green-500" },
    { title: "Total de Pedidos", value: totalOrders.toString(), icon: ShoppingCart, link: "/dashboard/sales", color: "text-blue-500" },
    { title: "Produtos Cadastrados", value: totalProducts.toString(), icon: Package, link: "/dashboard/products", color: "text-purple-500" },
    { title: "Itens com Baixo Estoque", value: lowStockItems.toString(), icon: AlertTriangle, link: "/dashboard/stock", color: lowStockItems > 0 ? "text-red-500" : "text-yellow-500" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-foreground">Visão Geral do Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <Link href={card.link} passHref>
                <Button variant="link" className="text-xs text-muted-foreground px-0 hover:text-primary">
                  Ver detalhes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Vendas Recentes (Simulado)</CardTitle>
            <CardDescription>Últimos 5 pedidos processados.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockOrders.slice(0, 5).map(order => (
                <li key={order.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">Pedido #{order.id.slice(0,6)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                     <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-500' : order.status === 'Shipped' ? 'text-blue-500' : 'text-yellow-500'}`}>{order.status}</p>
                     <p className="text-xs text-muted-foreground">R$ {order.totalAmount.toFixed(2).replace('.',',')}</p>
                  </div>
                </li>
              ))}
            </ul>
             <Link href="/dashboard/sales" passHref>
                <Button variant="outline" className="w-full mt-4">Ver todos os pedidos</Button>
              </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Performance de Vendas Mensal</CardTitle>
            <CardDescription>Receita total por mês (dados simulados).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted))', opacity: 0.5}}
                  contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                  labelStyle={{color: 'hsl(var(--foreground))'}}
                />
                <Legend wrapperStyle={{fontSize: '12px'}}/>
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Receita"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
