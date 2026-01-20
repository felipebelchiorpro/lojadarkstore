"use client";

import React from 'react';

interface InfoItemProps {
  emoji: string;
  title: string;
  subtitle: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ emoji, title, subtitle }) => {
  return (
    <div className="flex items-center space-x-3 md:space-x-4 p-3">
      <div className="flex-shrink-0 text-2xl md:text-4xl">
        {emoji}
      </div>
      <div>
        <h3 className="text-xs md:text-base font-bold text-foreground">{title}</h3>
        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

const infoItemsData: InfoItemProps[] = [
  {
    emoji: '🛵',
    title: 'Entrega e Retirada',
    subtitle: 'Caconde e região',
  },
  {
    emoji: '💳',
    title: 'Pagamento Facilitado',
    subtitle: 'Em até 3x sem Juros',
  },
  {
    emoji: '🛡️',
    title: 'Sua Compra Segura',
    subtitle: 'Site 100% Protegido',
  },
  {
    emoji: '💬',
    title: 'Atendimento Exclusivo',
    subtitle: 'Suporte via WhatsApp',
  },
];

export default function InfoBar() {
  return (
    <section className="bg-background py-6 sm:py-8 border-y border-border/40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          {infoItemsData.map((item, index) => (
            <InfoItem key={index} emoji={item.emoji} title={item.title} subtitle={item.subtitle} />
          ))}
        </div>
      </div>
    </section>
  );
}
