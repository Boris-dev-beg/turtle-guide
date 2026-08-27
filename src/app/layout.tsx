import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turtle Guide",
  description: "Aide dans vos demarche administratives",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full w-full">{children}</body>
    </html>
  );
}
