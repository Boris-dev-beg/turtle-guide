"use client";
import { LucideIcon } from "lucide-react";;

export default function Form_layout({
  children,
  title,
  description,
  icon: Icon,
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Icône */}
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <Icon className="size-12" />
      </div>

      {/* Titre */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>

        <p className="mt-3 leading-6 text-slate-500">{description}</p>
      </div>

      {/* Formulaire */}
      <>
        {children}
      </>
    </div>
  );
}
