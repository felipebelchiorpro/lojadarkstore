"use client";

import React from 'react';
import { Truck, Barcode, MessageCircle, CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
}

export default function InfoBar() {
  const infoItemsData: InfoItemProps[] = [
    {
      icon: <Truck size={24} strokeWidth={2} />,
      title: 'Entrega e Retirada',
      subtitle: 'Caconde e região',
    },
    {
      icon: <CreditCard size={24} strokeWidth={2} />,
      title: 'Pagamento Facilitado',
      subtitle: 'Em até 3x sem Juros',
    },
    {
      icon: <ShieldCheck size={24} strokeWidth={2} />,
      title: 'Sua Compra Segura',
      subtitle: 'Site 100% Protegido',
    },
    {
      icon: <MessageCircle size={24} strokeWidth={2} />,
      title: 'Atendimento Exclusivo',
      subtitle: 'Suporte via WhatsApp',
    },
  ];

  return (
    <section className="bg-background py-6 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Horizontal scroll on mobile, grid/flex on desktop */}
        <div className="flex flex-nowrap overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:flex lg:flex-nowrap lg:justify-between pb-4 lg:pb-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {infoItemsData.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <div className="flex items-center bg-card rounded-full p-1.5 pr-6 shadow-sm w-[320px] lg:w-auto h-20 border border-border">
                <div className="min-h-[50px] min-w-[50px] h-[50px] w-[50px] flex-shrink-0 bg-primary text-primary-foreground flex items-center justify-center rounded-full mr-3">
                  {item.icon}
                </div>
                <div className="flex flex-col justify-center h-full">
                  <h3 className="text-xs sm:text-sm font-bold text-card-foreground leading-tight">{item.title}</h3>
                  {item.subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5">{item.subtitle}</p>}
                  {item.linkText && <span className="text-[10px] sm:text-xs text-primary font-medium underline mt-0.5 cursor-pointer">{item.linkText}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
