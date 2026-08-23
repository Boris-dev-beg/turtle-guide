"use client";
import { BellRing, Folder, Home, Info, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const datas = [
  {
    icon: Home,
    label: "Accueil",
    href: "/",
  },
  {
    icon: Folder,
    label: "Dossiers",
    href: "/",
  },
  {
    icon: BellRing,
    label: "Alertes",
    href: "/",
  },
  {
    icon: Info,
    label: "À propos",
    href: "/",
  },
];

export default function BottomNav() {
  // ! States
  const [isActive, setIsActive] = useState("Accueil");
  return (
    <footer className="fixed md:hidden bottom-0 inset-x-0 bg-turtle-bg border border-turtle-border pt-2 h-15 flex">
      <div className="wrapper grid grid-cols-4 max-md:w-full gap-2 px-2">
        {datas.map((link, index) => (
          <Link_
            key={index}
            href={link.href}
            label={link.label}
            icon={link.icon}
            isActive={isActive}
            onClick={(car) => setIsActive(car)}
          />
        ))}
      </div>
    </footer>
  );
}

const Link_ = ({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: string;
  onClick: (car: string) => void;
}) => {
  return (
    <Link
      onClick={() => onClick(label)}
      href={href}
      className={`${isActive === label ? "bg-turtle-primary/80 text-white -translate-y-6 pb-3 font-bold rounded-t-4xl p-2" : ""} flex flex-col items-center transition-transform duration-300 ease-in-out`}
    >
      <Icon className={`size-7`} />
      <h3>{label}</h3>
    </Link>
  );
};
