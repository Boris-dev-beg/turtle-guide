import Header from "@/components/layout/Header";
import BottomNav from "@/components/shared/BottomNav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col max-w-screen">
      <Header />
      <main className="mb-15 max-[500px]:px-5 max-w-[90vw] mx-auto lg:mx-20 flex flex-col" >
        {children}
      </main>
      <BottomNav />
    </section>
  );
}
