import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professionals } from "./_components/professionals";
import { getBarbers } from "./_data-access/get-barbers";

export const revalidate = 60;

export default async function HomePage() {

  const barbers = await getBarbers();

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      <div>
        <Hero />
        <Professionals barbers={barbers} />
        <Footer />
      </div>
    </main>
  );
}
