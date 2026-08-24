import { ListFilter } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Procedure_card } from "@/components/card/Procedures.card";
import { InputDemo, SelectDemo } from "@/components/shared/inputs";

const procedures = [
  {
    title: "Demande de carte nationale d'identité",
    description: "Obtenez une nouvelle carte d'identité ou un renouvellement.",
    category: "Documents d'identité",
  },
  {
    title: "Demande de passport",
    description: "Faites votre demande de passeport biometrique.",
    category: "Documents d'identité",
  },
  {
    title: "Déclaration de naissance",
    description: "Déclarz la naissance de votre enfant à l'état civil.",
    category: "État civil",
  },
  {
    title: "Acte de mariage",
    description: "Constituez votre dossier pour le mariage civil.",
    category: "État civil",
  },
  {
    title: "Certificat de nationalité",
    description: "Demandez un certificat de nationalité camerounais.",
    category: "État civil",
  },
  {
    title: "Demande d'attestation de domicile",
    description: "Obtenez votre attestation de domicile.",
    category: "Logement",
  },
  {
    title: "Carte de demandeur d'emploi",
    description: "Inscrivez-vous comme demandeur d'emploi.",
    category: "Travail & Emploi",
  },
  {
    title: "Bourse d'études",
    description: "Faites votre demande de bourse pour vos études.",
    category: "Éducation",
  },
  {
    title: "Carte d'assurance maladie",
    description: "Inscrivez-vous à l'assurance maladie universelle.",
    category: "Santé",
  },
];

export default function page() {
  return (
    <section className="flex flex-col h-full">
      <div className="h-full flex flex-col py-5 gap-5">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-turtle-primary max-w-xl lg:max-w-2xl">
            Quelle démarche souhaitez-vous effectuer ?
          </h1>
          <p className="text-turtle-slate">
            Choississez la procédure qui correspond à votre besoin.
          </p>
          <div className="flex flex-col gap-3">
            <InputDemo />

            <InputGroup className="py-5 w-fit focus-within:ring-turtle-primary-border! focus-within:border-none!">
              <InputGroupAddon>
                <ListFilter className="size-5" />
              </InputGroupAddon>
              <SelectDemo />
            </InputGroup>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-md:w-full gap-4">
          {procedures.map((proc, index) => (
            <Procedure_card
              key={index}
              title={proc.title}
              description={proc.description}
              category={proc.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
