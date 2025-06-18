"use client";

import Link from 'next/link';
import { Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t border-border/40">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-2">DarkStore Suplementos</h3>
            <p className="text-sm text-muted-foreground">Sua jornada para o próximo nível começa aqui. Qualidade e performance em cada scoop.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Links Rápidos</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Produtos</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Siga-nos</h4>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors"><Github size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} DarkStore Suplementos. Todos os direitos reservados.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Este é um site de demonstração.
          </p>
        </div>
      </div>
    </footer>
  );
}
