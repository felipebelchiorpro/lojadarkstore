
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@/types";

interface BannerProps {
  promotions: Promotion[];
}

export function Banner({ promotions }: BannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-lg overflow-hidden border border-border/40 shadow-none"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{ loop: true }}
      aria-roledescription="carousel"
      aria-label="Destaques e promoções"
    >
      <CarouselContent>
        {promotions.map((promotion) => (
          <CarouselItem key={promotion.id}>
            <Card className="bg-card border-0 shadow-none rounded-none">
              <CardContent className="relative flex aspect-[16/7] items-center justify-center p-0">
                <Image
                  src={promotion.imageUrl}
                  alt={promotion.title}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-75"
                  data-ai-hint="fitness promotion"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6 text-center">
                  <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4 shadow-md">
                    {promotion.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl shadow-sm">
                    {promotion.description}
                  </p>
                  <Link href={promotion.link} passHref>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-md transition-transform duration-150 ease-in-out hover:scale-105">
                      Ver Oferta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
    </Carousel>
  );
}
