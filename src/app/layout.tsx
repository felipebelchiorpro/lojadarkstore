
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { CartProvider } from '@/context/CartContext';
import { BrandProvider } from '@/context/BrandContext';
import { ProductProvider } from '@/context/ProductContext';
import { PromotionProvider } from '@/context/PromotionContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DarkStore Suplementos',
  description: 'Sua loja de suplementos para performance e saúde.',
  keywords: 'suplementos, whey protein, creatina, vitaminas, e-commerce, fitness, darkstore',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <AuthProvider>
          <CustomerAuthProvider>
            <BrandProvider>
              <ProductProvider>
                <PromotionProvider>
                  <FavoritesProvider>
                    <CartProvider>
                      <ConditionalLayout>
                        {children}
                      </ConditionalLayout>
                      <Toaster />
                    </CartProvider>
                  </FavoritesProvider>
                </PromotionProvider>
              </ProductProvider>
            </BrandProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
