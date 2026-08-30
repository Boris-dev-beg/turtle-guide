import { Back } from "@/components/shared/links";
import Header from "../../_components/Procedures/Header";
import { Procedures_Zone } from "./Procedures";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <section className="wrapper flex flex-col h-full w-full">
      <Back href="/categories" />
      {/* Header */}
      <Header
        title="Choisissez la procédure à suivre"
        description="Sélectionnez la procédure exacte qui correspond à votre besoin."
      />

      {/* Procedures */}
      <Procedures_Zone title={decodeURIComponent(slug)} />
    </section>
  );
}
