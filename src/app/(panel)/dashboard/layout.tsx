import type { Metadata } from "next";
import { SidebarDashboard } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Painel da Barbearia",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarDashboard>{children}</SidebarDashboard>
    </>
  );
}
