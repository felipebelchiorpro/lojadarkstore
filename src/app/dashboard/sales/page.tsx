"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockOrders as initialOrders } from "@/data/mockData";
import type { Order } from "@/types";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export default function SalesReportPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders
    .filter(order => {
      const searchMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.userId.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Delivered': return 'default'; // Using 'default' which is primary color based on theme
      case 'Shipped': return 'secondary'; // Or some other variant
      case 'Pending': return 'outline'; // Example: Yellowish or orange
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusColorClass = (status: Order['status']): string => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50';
      case 'Shipped': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50';
      case 'Cancelled': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50';
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold text-foreground">Relatório de Vendas</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Buscar por ID do pedido ou usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Pending">Pendente</SelectItem>
              <SelectItem value="Shipped">Enviado</SelectItem>
              <SelectItem value="Delivered">Entregue</SelectItem>
              <SelectItem value="Cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar CSV (Simulado)
        </Button>
      </div>

      <div className="bg-card p-0 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID do Pedido</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Usuário ID</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Itens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id.substring(0,8)}...</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell className="text-right">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`text-xs ${getStatusColorClass(order.status)}`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
              </TableRow>
            )) : (
               <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum pedido encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
