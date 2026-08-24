import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { OurEngagements_infos } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";

export default function OurEngagements() {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <h2 className="font-semibold text-2xl">{OurEngagements_infos.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {OurEngagements_infos.elements.map((eng, index) => (
          <Card_
            key={index}
            icon={eng.icon}
            title={eng.title}
            description={eng.description}
          />
        ))}
      </div>
    </section>
  );
}

const Card_ = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <Card className="flex items-center p-4">
      <span className="p-4 rounded-full bg-turtle-primary-light text-turtle-primary">
      <Icon className="size-10 md:size-14" />
      </span>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      <CardDescription className="text-center line-clamp-3">
        {description}
      </CardDescription>
    </Card>
  );
};
