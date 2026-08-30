import { BackToHome } from "@/components/shared/links";
import Header from "../_components/Procedures/Header";
import { Categories } from "./Categories";

export default function page() {
  return (
    <section className="flex flex-col">
      {/* Header */}
      <BackToHome />
      <Header
        title="Choisissez la catégorie de votre démarche"
        description="Sélectionnez le domaine qui correspond le mieux à la démarche que vous
          souhaitez effectuer."
      />
      {/* Body */}
      <Categories />
    </section>
  );
}
