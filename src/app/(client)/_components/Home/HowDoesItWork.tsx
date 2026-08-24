import { HowDoesItWork_infos } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";

export default function HowDoesItWork() {
  return (
    <div className="flex flex-col gap-4 relative">
      <h2 className="font-semibold text-xl">{HowDoesItWork_infos.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HowDoesItWork_infos.element.map((elt, index) => (
          <Card_
            key={index}
            icon={elt.icon}
            title={elt.title}
            description={elt.description}
            isCard
          />
        ))}
      </div>
      <div className="turtle-alert-warning max-md:*:flex-col *:items-center flex gap-2 justify-center">
        <Card_
          icon={HowDoesItWork_infos.alert.icon}
          icon_class="text-turtle-accent"
          title={HowDoesItWork_infos.alert.title}
          description={HowDoesItWork_infos.alert.description}
        />
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
