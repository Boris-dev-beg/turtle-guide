import { ContentMetric } from "../../types/types";
import ContentCard from "../Cards/ContentCard";

export default function ManageContent({
  metrics,
}: {
  metrics: ContentMetric[];
}) {
  return (
    <>
    <section
      aria-label="Indicateurs clés"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <ContentCard key={metric.key} metric={metric} />
      ))}
    </section>

    <section>
      <div></div>
    </section>
    </>
  );
}
