import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "../components/session.auth";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientContext } from "@/providers/queryclient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberPro - Agendamento de Serviços para Barbearias",
  description:
    "Conectando você às melhores barbearias da sua região. Agende seu horário com facilidade e descubra serviços de qualidade perto de você.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <QueryClientContext>
          <Toaster position="top-right" duration={2500} />
          {children}
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
