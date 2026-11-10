import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/queryProvider";
export const metadata: Metadata = {
  title: "TurtleGuide — Vos démarches, pas à pas",
  description:
    "TurtleGuide vous accompagne pas à pas dans vos démarches administratives et judiciaires au Cameroun.",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body
        className="min-h-full w-full"
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
