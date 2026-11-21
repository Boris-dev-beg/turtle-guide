import { getcontentData } from "@/services/content.service";
import SectionLayout from "../_components/shared/SectionLayout";
import ManageContent from "../_components/Sections/ManageContent";

/** Charge les compteurs et les événements d'audit associés au sous-onglet demandé. */
export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const data = await getcontentData();
  const allowedTabs = new Set([
    "all",
    "categories",
    "procedures",
    "processes",
    "documents",
    "quality",
  ]);
  const selectedTab = tab && allowedTabs.has(tab) ? tab : "all";
  return (
    <SectionLayout
      title="Gestion du contenu"
      subtitle="Gerez les catégories, les procédures, les démarches, les étapes et les documents"
    >
      <ManageContent data={data} selectedTab={selectedTab} />
    </SectionLayout>
  );
}
