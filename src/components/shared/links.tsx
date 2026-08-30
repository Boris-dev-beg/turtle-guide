import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackToHome() {
  return (
    <Link
      href="/"
      className="flex gap-1 text-primary hover:underline hover:text-primary/90 p-2 group cursor-pointer w-fit"
    >
      <ArrowLeft className="size-5 group-hover:-translate-x-0.5" />
      Retour à l&apos;accueil
    </Link>
  );
}

export function Back({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex gap-1 text-primary hover:underline hover:text-primary/90 p-2 group cursor-pointer w-fit"
    >
      <ArrowLeft className="size-5 group-hover:-translate-x-0.5" />
      Retour
    </Link>
  );
}
