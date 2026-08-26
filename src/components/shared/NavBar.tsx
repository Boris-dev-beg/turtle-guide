"use client";
import { links } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const NavBar = () => {
  // ! States
  const pathName = usePathname();

  return (
    <div className="flex gap-4 items-center">
      <nav className="hidden md:flex items-center gap-5 px-5 *:hover:font-semibold">
        {links.map((link, index) => (
          <Link_
            key={index}
            icon={link.icon}
            href={link.href}
            label={link.label}
            pathName={pathName}
          />
        ))}
      </nav>

      <button className="btn btn-outline">Se connecter</button>
    </div>
  );
};

const Link_ = ({
  href,
  label,
  icon: Icon,
  pathName
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathName: string
}) => {
  return (
    <Link
      href={href}
      className={`${pathName === href? "border-b font-semibold" : "hover:border-b"} flex gap-1 items-center px-3 py-2 transition-all duration-300`}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
};
