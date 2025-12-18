"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const session = false; 


  const navItems = [
    { label: "Barbearias", href: "#barbearias" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          className="text-white hover:text-barber-gold transition-colors font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}


      {session ? (
        <Button
          asChild
          className="text-white hover:text-barber-gold transition-colors font-medium"
          onClick={() => {
            // Add logout logic here
            setIsMenuOpen(false);
          }}
        >
          <Link href="/logout">Sair</Link>
        </Button>
      ) : (
        <Button
          asChild
          className="text-white hover:text-barber-gold transition-colors font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          <Link href="/login">Acessar Minha Barbearia</Link>
        </Button>
      )}



      
    </>
  );

 

  return (
    <header className="fixed top-0 left-0 z-50 right-0 bg-barber-primary shadow-barber-gold/90 shadow-sm py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <h1 className="text-3xl font-bold text-white ">
            Barber<span className="text-barber-gold">Pró</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center py-2 px-2 gap-6">
          <NavLinks />
        </nav>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-white hover:text-barber-gold transition-colors cursor-pointer"
              variant={"ghost"}
              size={"icon"}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-64 bg-barber-primary text-white "
          >
            <SheetHeader>
              <SheetTitle className="text-lg font-bold  text-white">
                Menu
              </SheetTitle>
              <SheetDescription className="text-white">
                Navegue pelo site
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col space-y-4 py-5 px-5">
              <NavLinks />
            </nav>

          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
