"use client";
import { links } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  // ! States
  const pathName = usePathname();
  return (
    <footer className="fixed md:hidden bottom-0 w-full bg-secondary h-18 wrapper grid grid-cols-3 min-[500px]:gap-2 place-items-center">
        {links.map((link, index) => (
          <Link_
            key={index}
            href={link.href}
            label={link.label}
            icon={link.icon}
            pathName={pathName}
          />
        ))}
    </footer>
  );
}

const Link_ = ({
  href,
  label,
  icon: Icon,
  pathName,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathName: string;
}) => {
  return (
    <Link
      href={href}
      className={`${pathName === href ? "text-primary *:fill-primary border-t-2 border-primary py-2 font-bold" : "hover:text-primary hover:*:fill-primary hover:border-t-2 border-primary py-2 font-bold"} transition-all duration-300 flex flex-col items-center ease-in-out`}
    >
      <Icon className={`size-7`} />
      <p>{label}</p>
    </Link>
  );
};
