"use client";

import type { Product } from "@/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback, useEffect } from "react";

interface ProductListCarouselProps {
    products: Product[];
    title?: string;
}

const CarouselDots = ({ api, onDotClick }: { api: CarouselApi | undefined, onDotClick: (index: number) => void }) => {
    const [snapCount, setSnapCount] = useState(0);
    const [currentSnap, setCurrentSnap] = useState(0);

    const updateDots = useCallback(() => {
        if (!api) return;
        setSnapCount(api.scrollSnapList().length);
        setCurrentSnap(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;

        updateDots();
        api.on("select", updateDots);
        api.on("reInit", updateDots);

        return () => {
            api.off("select", updateDots);
            api.off("reInit", updateDots);
        };
    }, [api, updateDots]);

    if (snapCount <= 1) return null;

    return (
        <div className="flex justify-center items-center space-x-1.5 sm:space-x-2 mt-2 sm:mt-3 py-1.5 sm:py-2">
            {Array.from({ length: snapCount }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={cn(
                        "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-300 ease-in-out",
                        index === currentSnap ? "bg-primary scale-110 sm:scale-125" : "bg-primary/40 hover:bg-primary/60"
                    )}
                    aria-label={`Ir para slide ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default function ProductListCarousel({ products, title }: ProductListCarouselProps) {
    const [carouselLoopThreshold, setCarouselLoopThreshold] = useState(3);
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );
    const [api, setApi] = useState<CarouselApi>();
    const handleDotClick = useCallback((index: number) => api?.scrollTo(index), [api]);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth < 768) {
                    setCarouselLoopThreshold(1);
                } else if (window.innerWidth < 1024) {
                    setCarouselLoopThreshold(2);
                } else {
                    setCarouselLoopThreshold(3);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (products.length === 0) return <p className="text-muted-foreground text-sm sm:text-base">Nenhum produto encontrado.</p>;

    return (
        <>
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full"
                opts={{
                    align: "start",
                    loop: products.length > carouselLoopThreshold,
                }}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="-ml-2 sm:-ml-4">
                    {products.map((product: Product) => (
                        <CarouselItem key={product.id} className="pl-2 sm:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <div className="h-full p-0.5 sm:p-1">
                                <ProductCard product={product} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-10px] sm:left-[-20px] md:left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground border-border shadow-md hidden sm:flex" />
                <CarouselNext className="absolute right-[-10px] sm:right-[-20px] md:right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground border-border shadow-md hidden sm:flex" />
            </Carousel>
            <CarouselDots api={api} onDotClick={handleDotClick} />
        </>
    );
}
