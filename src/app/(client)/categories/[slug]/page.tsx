import Header from "../../_components/Procedures/Header";

export default function page() {
  return (
    <section className="wrapper flex flex-col h-full w-full gap-2">
      {/* Header */}
      <Header title="Choisissez la procédure à suivre" description="Sélectionnez la procédure exacte qui correspond à votre besoin." />
    </section>
  );
}
