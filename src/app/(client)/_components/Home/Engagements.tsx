import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export default function Engagements() {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <h2 className="font-semibold text-xl">Nos engagements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5"></div>
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
    <Card className="flex items-center flex-col">
      <Icon className="size-15 p-2 rounded-full bg-turtle-primary-light text-turtle-primary" />
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
};
