import Header from "../_components/Procedures/Header";
import { Categories } from "./Categories";

export default function page() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Header
        title="Choisissez la catégorie de votre démarche"
        description="Sélectionnez le domaine qui correspond le mieux à la démarche que vous
          souhaitez effectuer."
      />
      {/* Body */}
      <Categories />
    </div>
  );
}
