"use client";
import { links } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const NavBar = () => {
  // ! States
  const pathName = usePathname();

  return (
    <div className="flex gap-2 lg:gap-4 items-center">
      <nav className="hidden md:flex items-center gap-2 md:gap-5 lg:px-5 *:hover:font-semibold">
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

      <button className="btn btn-outline py-2 px-3 sm:px-4 459678">Se connecter</button>
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
      className={`${pathName === href? "border-b font-semibold" : "hover:border-b"} flex gap-1 items-center px-2 lg:px-3 py-2 transition-all duration-300 sm:text-sm text-nowrap`}
    >
      <Icon className="md:size-5 size-4" />
      {label}
    </Link>
  );
};
