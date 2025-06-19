
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, TrendingUp, PieChart as PieChartIcon } from "lucide-react"; // Added TrendingUp, PieChartIcon
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip, // Aliased to avoid conflict with Shadcn Tooltip
  Legend as RechartsLegend,  // Aliased
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Placeholder data - replace with actual data fetching later
const totalRevenue = 12550.75;
const totalOrders = 88;
const totalProducts = 72;
const totalCustomers = 123;

// Mock data for Line Chart (Revenue)
const dailyRevenueData = [
  { date: "Jul 18", revenue: 250.75 },
  { date: "Jul 19", revenue: 310.50 },
  { date: "Jul 20", revenue: 290.00 },
  { date: "Jul 21", revenue: 350.20 },
  { date: "Jul 22", revenue: 410.00 },
  { date: "Jul 23", revenue: 380.60 },
  { date: "Jul 24", revenue: 450.90 },
];

const revenueChartConfig = {
  revenue: {
    label: "Receita (R$)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Mock data for Pie Chart (Sales by Category)
const salesByCategoryData = [
  { category: "Ganho de Massa", sales: 12300.50, fill: "var(--chart-1)" },
  { category: "Endurance", sales: 8500.00, fill: "var(--chart-2)" },
  { category: "Emagrecimento", sales: 6750.20, fill: "var(--chart-3)" },
  { category: "Vitaminas", sales: 5500.00, fill: "var(--chart-4)" },
  { category: "Outros", sales: 10500.00, fill: "var(--chart-5)" },
];

const categoryChartConfig = {
  sales: { label: "Vendas" }, // General label for the value in tooltips
  "Ganho de Massa": { label: "Ganho de Massa", color: "hsl(var(--chart-1))" },
  "Endurance": { label: "Endurance", color: "hsl(var(--chart-2))" },
  "Emagrecimento": { label: "Emagrecimento", color: "hsl(var(--chart-3))" },
  "Vitaminas": { label: "Vitaminas", color: "hsl(var(--chart-4))" },
  "Outros": { label: "Outros", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold text-foreground">Visão Geral</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2).replace('.',',')}</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado (simulado)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" /> 
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês passado (simulado)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
             <p className="text-xs text-muted-foreground">+5 novos produtos esta semana (simulado)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+10% novos clientes (simulado)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Receita Diária (Últimos 7 Dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="min-h-[250px] w-full">
              <LineChart
                accessibilityLayer
                data={dailyRevenueData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)} // Abbreviate date for X-axis
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `R$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="revenue"
                  type="monotone"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-revenue)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
                 <RechartsLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
             <PieChartIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="flex aspect-square items-center justify-center pb-0">
            <ChartContainer
              config={categoryChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="category" />} // nameKey is used to show category name in tooltip
                />
                <Pie
                  data={salesByCategoryData}
                  dataKey="sales"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {salesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsLegend
                  content={<ChartLegendContent nameKey="category" className="flex-wrap" />}
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
