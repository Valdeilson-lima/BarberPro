import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-barber-primary-dark/90 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} BarberPro. Todos os direitos reservados.
        </p>
        <p className="text-sm md:text-base">
          Desenvolvido por <Link href="https://github.com/Valdeilson-lima?tab=repositories" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-barber-gold">Valdeilson Lima</Link>
        </p>
      </div>
    </footer>
  );
}