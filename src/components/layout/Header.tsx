import Link from "next/link";

import Turtle from "../../assets/images/logo.png";
import Image from "next/image";
import { NavBar } from "../shared/NavBar";

export default function Header() {
  return (
    <header className="w-full flex p-4 sticky top-0 z-50 bg-primary backdrop-blur-md max-h-18 overflow-hidden text-muted">
      <div className="wrapper w-full flex justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex gap-2 items-center font-heading"
        >
          <Image src={Turtle} alt="Logo TurtleGuide" className="w-12 h-11" />
          <span className="flex flex-col leading-5">
            <h1 className="text-[26px] font-bold">TurtleGuide</h1>
            <p className="text-sm">Votre guide pour chaque demarche</p>
          </span>
        </Link>

        {/* Nav bar */}
        <NavBar />
      </div>
    </header>
  );
}
