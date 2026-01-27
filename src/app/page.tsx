
import React from 'react';
import { Banner } from "@/components/Banner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import InfoBar from '@/components/InfoBar';
import BrandCarousel from '@/components/BrandCarousel';
import ProductListCarousel from '@/components/ProductListCarousel';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchProductsService } from '@/services/productService';
import { fetchPromotionsService } from '@/services/promotionService';

// Force dynamic rendering to ensure fresh data (stock prices, etc.)
// Alternatively, usage of 'revalidate' could be better for cache, but user wants "real time" feel usually.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Parallel data fetching
  const [allProducts, promotions] = await Promise.all([
    fetchProductsService().catch(err => {
      console.error("Failed to fetch products", err);
      return [];
    }),
    fetchPromotionsService().catch(err => {
      console.error("Failed to fetch promotions", err);
      return [];
    })
  ]);

  // Data Filtering (Server Side)
  const featuredProducts = allProducts.slice(0, 8);
  const newReleaseProducts = allProducts.filter(p => p.isNewRelease).slice(0, 8);
  const bestSellingProducts = [...allProducts]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 8);
  // Re-verify logic: User wanted ONLY "Mais Vendidos" (Best Sellers) and "Lançamentos" (New Releases).
  // AND the grid sections.
  // "Populares" (Featured) was removed.
  // "Em Promoção" (On Sale) was removed.

  const mainCarouselPromotions = promotions.filter(p => !p.position || p.position === 'main_carousel');
  const gridLeft = promotions.find(p => p.position === 'grid_left');
  const gridTopRight = promotions.find(p => p.position === 'grid_top_right');
  const gridBottomLeft = promotions.find(p => p.position === 'grid_bottom_left');
  const gridBottomRight = promotions.find(p => p.position === 'grid_bottom_right');

  return (
    <div className="flex flex-col">
      <section aria-labelledby="banner-heading" className="w-full">
        <h2 id="banner-heading" className="sr-only">Promoções e Destaques</h2>
        <Banner promotions={mainCarouselPromotions} />
      </section>

      <div className="container mx-auto px-4 py-8 space-y-8 sm:space-y-12">
        <div className="hidden md:block">
          <InfoBar />
        </div>

        {/* Lançamentos Section */}
        <section aria-labelledby="new-releases-heading">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 id="new-releases-heading" className="font-headline text-2xl sm:text-3xl font-semibold text-foreground uppercase">Lançamentos</h2>
            <Link href="/products?tag=lancamentos" passHref>
              <Button variant="ghost" className="text-primary hover:text-primary/90 text-xs sm:text-sm px-2 sm:px-3">
                Ver Todos <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
          <ProductListCarousel products={newReleaseProducts} />
        </section>

        {/* Mais Vendidos Section */}
        <section aria-labelledby="best-selling-products-heading">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 id="best-selling-products-heading" className="font-headline text-2xl sm:text-3xl font-semibold text-foreground uppercase">Mais Vendidos</h2>
            <Link href="/products?filter=best-sellers" passHref>
              <Button variant="ghost" className="text-primary hover:text-primary/90 text-xs sm:text-sm px-2 sm:px-3">
                Ver Todos <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
          <ProductListCarousel products={bestSellingProducts} />
        </section>

        {/* Destaques da Loja (Grid) */}
        <section aria-labelledby="featured-categories-heading">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 id="featured-categories-heading" className="font-headline text-2xl sm:text-3xl font-semibold text-foreground uppercase">Destaques da loja</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* GRID LEFT (LARGE VERTICAL) */}
            <Link href={gridLeft?.link || "/products?category=GANHO%20DE%20MASSA"} passHref>
              <div className="group relative aspect-[3/4] sm:aspect-video md:aspect-[3/4] overflow-hidden rounded-lg border border-border/40 hover:border-border/70 shadow-none transition-all duration-300 cursor-pointer">
                <Image
                  src={gridLeft?.imageUrl || "https://placehold.co/600x800.png?text=Destaque+Esquerda"}
                  alt={gridLeft?.title || "Destaque"}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105 brightness-50 group-hover:brightness-75"
                  data-ai-hint="muscle fitness torso"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 sm:p-6 text-center">
                  <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-primary uppercase shadow-md mb-2 sm:mb-3">
                    {gridLeft?.title || "GANHO DE MASSA"}
                  </h3>
                  <Button variant="secondary" size="sm" className="bg-neutral-800/80 hover:bg-neutral-900/90 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">Ver Agora</Button>
                </div>
              </div>
            </Link>

            <div className="grid grid-rows-2 gap-3 sm:gap-4 md:gap-6">
              {/* GRID TOP RIGHT (WIDE) */}
              <Link href={gridTopRight?.link || "/products?category=ENDURANCE"} passHref>
                <div className="group relative h-full w-full overflow-hidden rounded-lg border border-border/40 hover:border-border/70 shadow-none transition-all duration-300 cursor-pointer">
                  <Image
                    src={gridTopRight?.imageUrl || "https://placehold.co/800x400.png?text=Destaque+Topo"}
                    alt={gridTopRight?.title || "Destaque"}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105 brightness-50 group-hover:brightness-75"
                    data-ai-hint="runner motion"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 text-center">
                    <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-primary uppercase shadow-md mb-1.5 sm:mb-2">
                      {gridTopRight?.title || "ENDURANCE"}
                    </h3>
                    <Button variant="secondary" size="sm" className="bg-neutral-800/80 hover:bg-neutral-900/90 text-white px-3 sm:px-5 py-1 sm:py-1.5 text-xs sm:text-sm">Ver Agora</Button>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-full">
                {/* GRID BOTTOM LEFT */}
                <Link href={gridBottomLeft?.link || "/products?category=EMAGRECIMENTO"} passHref>
                  <div className="group relative h-full w-full overflow-hidden rounded-lg border border-border/40 hover:border-border/70 shadow-none transition-all duration-300 cursor-pointer">
                    <Image
                      src={gridBottomLeft?.imageUrl || "https://placehold.co/400x400.png?text=Peq+Esq"}
                      alt={gridBottomLeft?.title || "Destaque"}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105 brightness-50 group-hover:brightness-75"
                      data-ai-hint="waist measure fitness"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-3 text-center">
                      <h3 className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-primary uppercase shadow-md mb-1 sm:mb-2">
                        {gridBottomLeft?.title || "EMAGRECIMENTO"}
                      </h3>
                      <Button variant="secondary" size="sm" className="bg-neutral-800/80 hover:bg-neutral-900/90 text-white px-2.5 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-xs h-7">Ver Agora</Button>
                    </div>
                  </div>
                </Link>

                {/* GRID BOTTOM RIGHT */}
                <Link href={gridBottomRight?.link || "/products?category=DEFINIÇÃO"} passHref>
                  <div className="group relative h-full w-full overflow-hidden rounded-lg border border-border/40 hover:border-border/70 shadow-none transition-all duration-300 cursor-pointer">
                    <Image
                      src={gridBottomRight?.imageUrl || "https://placehold.co/400x400.png?text=Peq+Dir"}
                      alt={gridBottomRight?.title || "Destaque"}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105 brightness-50 group-hover:brightness-75"
                      data-ai-hint="abs fitness definition"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-3 text-center">
                      <h3 className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-primary uppercase shadow-md mb-1 sm:mb-2">
                        {gridBottomRight?.title || "DEFINIÇÃO"}
                      </h3>
                      <Button variant="secondary" size="sm" className="bg-neutral-800/80 hover:bg-neutral-900/90 text-white px-2.5 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-xs h-7">Ver Agora</Button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <BrandCarousel />

        <section aria-labelledby="call-to-action-heading" className="py-8 sm:py-12 bg-card rounded-lg border border-border/40 shadow-none">
          <div className="container mx-auto text-center px-3 sm:px-4">
            <h2 id="call-to-action-heading" className="font-headline text-2xl sm:text-3xl font-semibold text-primary mb-3 sm:mb-4 uppercase">Pronto para Elevar seu Treino?</h2>
            <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md sm:max-w-xl mx-auto">
              Descubra nossa linha completa de suplementos e alcance seus objetivos de performance e saúde.
            </p>
            <Link href="/products" passHref>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-md transition-transform duration-150 ease-in-out hover:scale-105 text-sm sm:text-base">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <div className="md:hidden pb-4">
        <InfoBar />
      </div>
    </div>
  );
}
