import Header from "@/components/layout/Header";
import BottomNav from "@/components/shared/BottomNav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col">
      <Header />
      <main className="mb-15 wrapper px-5" >
        {children}
      </main>
      <BottomNav />
    </section>
  );
}
