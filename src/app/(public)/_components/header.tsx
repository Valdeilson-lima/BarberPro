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
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { handleRegister } from "../_actions/login";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navItems = [{ label: "Veja as Barbearias", href: "#barbearias" }];

  async function handleLogin() {
    await handleRegister("github");
  }

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          onClick={() => setIsMenuOpen(false)}
          key={item.href}
          asChild
          className="text-white hover:text-barber-gold transition-colors font-medium cursor-pointer px-4 py-1.5 text-sm md:text-base"
        >
          <Link href={item.href} className="text-base font-medium">
            
            {item.label}
          </Link>
        </Button>
      ))}

      {status === "loading" ? (
        <span className="text-white text-center">Carregando...</span>
      ) : session ? (
        
        <Link
          href="/dashboard"
          className="text-white bg-primary/90 px-4 py-1.5 rounded-md hover:text-barber-gold hover:bg-primary/90 transition-colors font-medium text-center text-sm md:text-base cursor-pointer"
        > 
          <LogIn className="w-4 h-4 mr-2 inline-block" />
          Acessar Barbearia
        </Link>
      ) : (
        <Button
          className="text-white hover:text-barber-gold transition-colors font-medium cursor-pointer px-4"
          onClick={handleLogin}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Portal da Barbearia
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
