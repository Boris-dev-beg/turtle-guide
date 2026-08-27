import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/shared/BottomNav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-w-screen min-h-screen w-full ">
      <Header />
      <main className="flex flex-col h-full flex-1 w-full">
        {children}
      </main>
        <Footer />
      <BottomNav />
    </section>
  );
}
