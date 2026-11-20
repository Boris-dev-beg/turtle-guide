import { getcontentData } from "@/services/content.service";
import SectionLayout from "../_components/shared/SectionLayout";
import ManageContent from "../_components/Sections/ManageContent";

export default async function page() {
  const metrics = await getcontentData();
  return (
    <SectionLayout
      title="Gestion du contenu"
      subtitle="Gerez les catégories, les procédures, les démarches, les étapes et les documents"
    >
      <ManageContent metrics={metrics} />
    </SectionLayout>
  );
}
