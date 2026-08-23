import Header from "@/components/layout/Header";
import BottomNav from "@/components/shared/BottomNav";
import Hero from "@/components/shared/Hero";

export default function Home() {
  return (
    <section className="flex flex-col">
      <Header />
      <main className="mb-15">
        <Hero />
      </main>
      <BottomNav />
    </section>
  );
}
