"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import {
  Banknote,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  List,
  Scissors,
  Settings,
} from "lucide-react";

import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Para o mobile Sheet
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // Para colapsar desktop

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={clsx(
           "hidden md:flex  flex-col bg-barber-primary-light border-r border-barber-gold h-full transition-all duration-300 md:fixed",
          {
            "w-20": isDesktopCollapsed,
            "w-64": !isDesktopCollapsed,
          }
        )}
      >
        <div className="flex items-center justify-between p-3 h-18 border-b border-barber-gold">
          {!isDesktopCollapsed && (
            <h1 className="text-2xl text-white font-bold">
              Barber<span className="text-barber-gold-dark">PRÓ</span>
            </h1>
          )}

          <Button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            variant={"outline"}
            size={"icon"}
            className="cursor-pointer"
          >
            {!isDesktopCollapsed ? (
              <ChevronRight className="w-5 h-5 rotate-180 transition-all duration-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 rotate-180 transition-all duration-500" />
            )}
          </Button>
        </div>

        {isDesktopCollapsed && (
          <nav className="flex flex-col gap-3 p-4 text-base">
            <SidebarItem
              href="/dashboard"
              label="Agendamentos"
              isCollapsed={isDesktopCollapsed}
              pathname={pathname}
              icon={<CalendarCheck className="w-5 h-5" />}
            />

            <SidebarItem
              href="/dashboard/services"
              label="Serviços"
              pathname={pathname}
              isCollapsed={isDesktopCollapsed}
              icon={<Scissors className="w-5 h-5" />}
            />

            <SidebarItem
              href="/dashboard/profile"
              label="Meu Perfil"
              pathname={pathname}
              isCollapsed={isDesktopCollapsed}
              icon={<Settings className="w-5 h-5" />}
            />

            <SidebarItem
              href="/dashboard/plans"
              label="Planos"
              pathname={pathname}
              isCollapsed={isDesktopCollapsed}
              icon={<Banknote className="w-5 h-5" />}
            />
          </nav>
        )}

        <Collapsible open={!isDesktopCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-3 p-4 text-base">
              <span className="text-sm text-white/40 font-medium mt-1 uppercase">
                Painel
              </span>
              <SidebarItem
                href="/dashboard"
                label="Agendamentos"
                isCollapsed={isDesktopCollapsed}
                pathname={pathname}
                icon={<CalendarCheck className="w-5 h-5" />}
              />

              <SidebarItem
                href="/dashboard/services"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isDesktopCollapsed}
                icon={<Scissors className="w-5 h-5" />}
              />

              <span className="text-sm text-white/40 font-medium mt-1 uppercase">
                Configurações
              </span>

              <SidebarItem
                href="/dashboard/profile"
                label="Meu Perfil"
                pathname={pathname}
                isCollapsed={isDesktopCollapsed}
                icon={<Settings className="w-5 h-5" />}
              />

              <SidebarItem
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isDesktopCollapsed}
                icon={<Banknote className="w-5 h-5" />}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>

      <div
        className={clsx(
          "flex flex-1 flex-col bg-barber-primary-light border-barber-gold transition-all duration-300",
          {
            "md:ml-20": isDesktopCollapsed,
            "md:ml-64": !isDesktopCollapsed,
          }
        )}
      >
        <header className="flex items-center justify-between px-2 md:px-6 h-14 z-10 border-b border-barber-gold md:hidden sticky top-0 bg-barber-primary-light">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="md:hidden cursor-pointer"
                >
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <h1 className="text-base md:text-lg text-white font-bold">
                Barber<span className="text-barber-gold-dark">PRÓ</span>
              </h1>
            </div>
            <SheetContent
              side="right"
              className="w-64 p-0 bg-barber-primary-light"
            >
              <SheetHeader className="p-4 border-b border-barber-gold/20">
                <SheetTitle className="text-lg font-bold text-white">
                  Menu
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-300">
                  Menu Administrativo
                </SheetDescription>
              </SheetHeader>

              <nav className="grid gap-3 pt-5 text-base">
                <SidebarItem
                  href="/dashboard"
                  label="Agendamentos"
                  isCollapsed={false}
                  pathname={pathname}
                  icon={<CalendarCheck className="w-5 h-5" />}
                  onClose={() => setIsMobileOpen(false)}
                />

                <SidebarItem
                  href="/dashboard/services"
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={false}
                  icon={<Scissors className="w-5 h-5" />}
                  onClose={() => setIsMobileOpen(false)}
                />

                <SidebarItem
                  href="/dashboard/profile"
                  label="Meu Perfil"
                  pathname={pathname}
                  isCollapsed={false}
                  icon={<Settings className="w-5 h-5" />}
                  onClose={() => setIsMobileOpen(false)}
                />

                <SidebarItem
                  href="/dashboard/plans"
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={false}
                  icon={<Banknote className="w-5 h-5" />}
                  onClose={() => setIsMobileOpen(false)}
                />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 py-4 px-2 md:p-6 bg-barber-primary">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
  onClose?: () => void;
}

function SidebarItem({
  href,
  icon,
  label,
  pathname,
  isCollapsed,
  onClose,
}: SidebarItemProps) {
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full" onClick={onClose}>
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-barber-gold/20 hover:translate-x-1",
          {
            "bg-barber-gold text-barber-primary font-semibold shadow-lg shadow-barber-gold/30":
              isActive,
            "text-gray-300 hover:text-white": !isActive,
            "justify-center": isCollapsed,
          }
        )}
      >
        <span
          className={clsx("w-6 h-6 transition-transform", {
            "scale-110": isActive,
          })}
        >
          {icon}
        </span>
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </div>
    </Link>
  );
}
