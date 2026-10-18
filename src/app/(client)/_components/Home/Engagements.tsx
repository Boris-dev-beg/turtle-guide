import { OurEngagements_infos } from "@/data/GlobalData";
import { Card_ } from "./cards/OurEngagement.card";

export default function OurEngagements() {
  return (
    <section className="wrapper w-full py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
