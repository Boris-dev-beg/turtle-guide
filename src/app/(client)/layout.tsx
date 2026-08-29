import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/shared/BottomNav";
import { getSession } from "@/lib/session";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <section className="flex flex-col max-[500px]:w-screen max-w-screen min-h-screen w-full">
      <Header name={session?.user.name || ""} />
      <main className="flex flex-col h-full flex-1 w-full mb-4">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </section>
  );
}
