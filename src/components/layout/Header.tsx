
"use client";

import Link from 'next/link';
import { ShoppingCart, UserCircle, Search, Menu as MenuIcon, LogIn, LayoutDashboard, Home, Package, Info, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { mockCategories, mainDropdownCategories } from "@/data/mockData"; // For category menu
import type { Category as TopCategoryType, DropdownCategory } from "@/types"; // For category menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-foreground'}`}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
      >
        {children}
      </Button>
    </Link>
  );
};

export default function Header() {
  const { getCartItemCount } = useCart();
  const { isAuthenticated, logout, user } = useAuth(); // Added user
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // State for category menu (moved from HomePage)
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [getCartItemCount]); // Removed isAuthenticated from deps, cart count independent of auth

  const mainSiteLinks = [
    { href: '/', label: 'Home', icon: <Home className="mr-2 h-4 w-4" /> },
    { href: '/products', label: 'Produtos', icon: <Package className="mr-2 h-4 w-4" /> },
    { href: '/about', label: 'Sobre Nós', icon: <Info className="mr-2 h-4 w-4" /> },
  ];

  const closeSheet = () => setIsSheetOpen(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      closeSheet();
    }
  };

  const topLevelCategories = mockCategories;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Upper Header Part (Logo, Search, Auth/Cart) */}
      <div className="bg-background border-b border-border/40">
        <div className="container mx-auto flex h-[88px] items-center justify-between px-4 space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" aria-label="SportZone Suplementos Home">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-primary">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM19.535 7.595L12 11.655L4.465 7.595L12 3.535L19.535 7.595Z" />
            </svg>
            <div className="flex flex-col">
              <span className="font-headline text-2xl font-bold text-white leading-tight">SportZone</span>
              <span className="text-[0.6rem] font-semibold text-gray-300 tracking-wider uppercase">SUPLEMENTOS</span>
            </div>
          </Link>

          {/* Search Bar - takes up most space on desktop */}
          <div className="hidden md:flex flex-grow max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Auth & Cart Links - Desktop */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="flex items-center text-sm text-white hover:text-primary">
                  <LayoutDashboard className="h-5 w-5 mr-2 text-primary" />
                  Minha Conta
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:text-primary text-sm">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center text-sm text-white hover:text-primary">
                  <UserCircle className="h-5 w-5 mr-1 text-primary" />
                  Cadastre-se
                </Link>
                <span className="text-sm text-gray-400">|</span>
                <Link href="/login" className="text-sm text-white hover:text-primary">
                  Fazer login
                </Link>
              </>
            )}
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="relative text-primary hover:text-primary/80" aria-label={`Carrinho com ${cartItemCount} itens`}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground transform translate-x-1/3 -translate-y-1/3">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile: Cart and Menu Trigger */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="mr-2 text-primary hover:text-primary/80" aria-label={`Carrinho com ${cartItemCount} itens`}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu" className="text-primary">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM19.535 7.595L12 11.655L4.465 7.595L12 3.535L19.535 7.595Z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-headline text-xl font-bold text-white">SportZone</span>
                       <span className="text-[0.5rem] font-semibold text-gray-300 tracking-wider uppercase">SUPLEMENTOS</span>
                    </div>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Fechar menu" className="text-primary">
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                </div>
                
                <div className="mb-6">
                  <SearchBar onSearch={handleSearch} />
                </div>

                <nav className="flex flex-col space-y-3 flex-grow">
                  {mainSiteLinks.map(link => (
                    <NavLink key={link.href} href={link.href} onClick={closeSheet}>
                      {link.icon} {link.label}
                    </NavLink>
                  ))}
                </nav>
                
                <hr className="my-3 border-border" />

                <div className="space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard" passHref>
                        <Button variant="ghost" className="w-full justify-start text-foreground" onClick={closeSheet}>
                          <LayoutDashboard className="mr-2 h-4 w-4 text-primary" /> Minha Conta
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => { logout(); closeSheet(); }}>
                        <LogIn className="mr-2 h-4 w-4 transform rotate-180" /> Sair
                      </Button>
                    </>
                  ) : (
                    <>
                     <Link href="/login" passHref>
                        <Button variant="ghost" className="w-full justify-start text-foreground" onClick={closeSheet}>
                          <UserCircle className="mr-2 h-4 w-4 text-primary" /> Cadastre-se
                        </Button>
                      </Link>
                      <Link href="/login" passHref>
                        <Button variant="ghost" className="w-full justify-start text-foreground" onClick={closeSheet}>
                          <LogIn className="mr-2 h-4 w-4 text-primary" /> Fazer login
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Lower Header Part (Category Navigation) */}
      <nav aria-labelledby="category-menu-heading" className="bg-card py-2.5 border-b border-border/40">
        <h2 id="category-menu-heading" className="sr-only">Navegar por Categorias</h2>
        <div className="container mx-auto px-2 flex items-center space-x-2">
            <div
                onMouseLeave={() => { setMainMenuOpen(false); }}
                className="relative"
            >
                <DropdownMenu open={mainMenuOpen} onOpenChange={setMainMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="uppercase text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 h-auto flex items-center whitespace-nowrap"
                            onMouseEnter={() => setMainMenuOpen(true)}
                            onClick={() => setMainMenuOpen(prev => !prev)} // Toggle on click for touch devices
                        >
                            <MenuIcon className="h-4 w-4 mr-2" />
                            CATEGORIAS
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-64 bg-background border-border shadow-lg"
                        onMouseEnter={() => setMainMenuOpen(true)} // Keep open if mouse re-enters
                        onMouseLeave={() => setMainMenuOpen(false)} // Close if mouse leaves content
                    >
                        <DropdownMenuLabel className="font-semibold text-foreground">Principais Categorias</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        {mainDropdownCategories.map((mainCat: DropdownCategory) => (
                            <Link key={mainCat.id} href={mainCat.href || "/products"} passHref>
                                <DropdownMenuItem 
                                    className="text-foreground hover:bg-muted focus:bg-muted"
                                    onClick={() => {setMainMenuOpen(false);}}
                                >
                                    {mainCat.name}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1 flex justify-center items-center overflow-x-auto whitespace-nowrap space-x-1 md:space-x-2 min-w-0">
              {topLevelCategories.map((category: TopCategoryType) => {
                const isComboOffer = category.id === "catComboOffers";
                const buttonClassName = `uppercase text-xs sm:text-sm font-semibold rounded-full px-4 sm:px-5 py-1.5 sm:py-2 h-auto whitespace-nowrap flex items-center transition-all duration-150 ease-in-out ${
                  isComboOffer
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:text-primary bg-transparent hover:bg-transparent"
                }`;

                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    passHref
                  >
                    <Button
                      variant={isComboOffer ? "default": "ghost"}
                      className={buttonClassName}
                    >
                      {category.name.toUpperCase()}
                    </Button>
                  </Link>
                );
              })}
            </div>
        </div>
      </nav>
    </header>
  );
}
