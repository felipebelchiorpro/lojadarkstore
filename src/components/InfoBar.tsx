
"use client";

import { Truck, CreditCard, ShieldCheck, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center space-x-3 md:space-x-4 p-3">
      <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary flex-shrink-0" />
      <div>
        <h3 className="text-sm md:text-base font-semibold text-foreground">{title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

const infoItemsData: InfoItemProps[] = [
  {
    icon: Truck,
    title: 'Entrega Rápida',
    subtitle: 'Para todo o País',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Facilitado',
    subtitle: 'Em até 3x sem Juros',
  },
  {
    icon: ShieldCheck,
    title: 'Sua Compra Segura',
    subtitle: 'Com Nuvem Pago', // You can change this subtitle if needed
  },
  {
    icon: MessageCircle,
    title: 'Atendimento Exclusivo',
    subtitle: 'Via WhatsApp',
  },
];

export default function InfoBar() {
  return (
    <section className="bg-background py-6 sm:py-8 border-y border-border/40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          {infoItemsData.map((item, index) => (
            <InfoItem key={index} icon={item.icon} title={item.title} subtitle={item.subtitle} />
          ))}
        </div>
      </div>
    </section>
  );
}
