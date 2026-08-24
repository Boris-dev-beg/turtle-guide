import {
  AlertTriangle,
  ArrowRight,
  FolderCheck,
  LucideIcon,
  MessageCircleQuestion,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import hero_img from "../../assets/images/hero.png";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex w-full">
      <div className="wrapper min-h-screen p-2 flex flex-col gap-4">
        {/* Image */}
        <div className="relative w-full flex flex-col md:flex-row">
          {/* Text */}
          <div className="flex flex-col gap-5 items-start w-full lg:max-w-md h-full lg:ml-15 justify-center max-md:absolute z-20 md:bg-transparent bg-turtle-bg/85">
            <span className="mb-1 text-4xl">
              <h1 className="font-semibold text-5xl">
                Toutes vos démarches administratives,
              </h1>
              <h2 className="text-turtle-accent font-semibold">
                simplement expliquées.
              </h2>
            </span>
            <p className="text-base max-w-md">
              TurtleGuide vous accompagne pas à pas pour comprendre vos
              démarches et éviter les anarques.
            </p>
            <Link
              href="/procedures"
              className="btn btn-accent w-40 gap-3 text-base"
            >
              Commencer <ArrowRight className="size-5" />
            </Link>
          </div>
          {/* Image */}
          <div className="relative w-full h-100">
            <Image
              src={hero_img}
              alt="Hero image"
              loading="eager"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* How does it work */}
        <div className="flex flex-col gap-4 relative">
          <h2 className="font-semibold text-xl">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card_
              icon={MessageCircleQuestion}
              title="1. Répondez à quelques questions"
              description="Nous comprenons votre situation"
              isCard
            />
            <Card_
              icon={FolderCheck}
              title="2. Recevez votre parcours personnalisé"
              description="Étapes, lieux et documents utiles"
              isCard
            />
            <Card_
              icon={ShieldCheck}
              title="3. Évitez les arnaques"
              description="Nos alertes vous protégent"
              isCard
            />
          </div>
          <div className="turtle-alert-warning max-md:*:flex-col *:items-center flex gap-2 justify-center">
            <Card_
              icon={AlertTriangle}
              icon_class="text-turtle-accent"
              title="Attention aux faux agents !"
              description="TurtleGuide ne délivre aucun document officiel. Méfiez-vous
                  des intermediaires."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Card_ = ({
  icon: Icon,
  title,
  description,
  isCard,
  icon_class,
}: {
  icon: LucideIcon;
  icon_class?: string;
  title: string;
  description: string;
  isCard?: boolean;
}) => {
  return (
    <span className={`${isCard ? "turtle-card shadow-none" : ""} flex gap-2.5`}>
      <Icon
        className={`size-10 ${icon_class ? icon_class : "text-turtle-primary"}`}
      />
      <span
        className={` ${icon_class ? "max-md:items-center max-md:*:text-center" : ""} flex flex-col`}
      >
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-turtle-text-muted text-sm">{description}</p>
      </span>
    </span>
  );
};
