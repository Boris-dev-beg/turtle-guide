import Hero from "@/app/(client)/_components/Home/Hero"; 
import OurEngagements from "./_components/Home/Engagements"; 
import PopularProcedures from "./_components/Home/PopularProcedures"; 
import Contact from "./_components/Home/Contact"; 
import HowDoesItWork from "./_components/Home/HowDoesItWork"; 

export default function Home() { 
  return ( 
    <section className="flex flex-col gap-6"> 
      <Hero /> 
      {/* Our engaments */} 
      <OurEngagements /> 
      {/* How does it work? */} 
      <HowDoesItWork /> 
      {/* Popular Procedures */} 
      <PopularProcedures /> 
      {/* Contact */} 
      <Contact /> 

    </section> 
  ); 
} 
