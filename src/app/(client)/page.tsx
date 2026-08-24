import Hero from "@/app/(client)/_components/Home/Hero";
import OurEngagements from "./_components/Home/Engagements";
import PopularProcedures from "./_components/Home/PopularProcedures";

export default function Home() {
  return (
    <section className="flex  flex-col gap-6">
      <Hero />
      {/* Our engaments */}
      <OurEngagements />
      {/* Popular Procedures */}
      <PopularProcedures />
    </section>
  );
}
