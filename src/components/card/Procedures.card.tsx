import { Baby, BriefcaseBusinessIcon, ChevronRight, FileText, GraduationCap, HandHeart, Home, Hospital, IdCard, Unlink2 } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

const icons = {
  documents: IdCard,
  civil: Baby,
  logement: Home,
  santé: Hospital,
  éducation: GraduationCap,
  emploi: BriefcaseBusinessIcon,
  mariage: HandHeart,
  nationalité: FileText,
};

export const Procedure_card = ({
  title,
  description,
  category,
}: {
  title: string;
  category: string;
  description: string;
}) => {
  const cat = category.toLocaleLowerCase();
  const lowTitle = title.toLocaleLowerCase();
  const Icon = cat.includes("documents")
    ? icons["documents"]
    : cat.includes("civil") && lowTitle.includes("naissance")
      ? icons["civil"]
      : cat.includes("civil") && lowTitle.includes("nationalité")
        ? icons["nationalité"]
        : cat.includes("civil") && lowTitle.includes("mariage")
          ? icons["mariage"]
          : cat.includes("logement")
            ? icons["logement"]
            : cat.includes("santé")
              ? icons["santé"]
              : cat.includes("éducation")
                ? icons["éducation"]
                : cat.includes("emploi")
                  ? icons["emploi"]
                  : Unlink2;
  return (
    <Card className="group hover:shadow-md hover:shadow-turtle-primary-light cursor-pointer">
      <CardHeader className="flex items-center gap-2">
        <Icon className="size-12 p-2 rounded-md bg-turtle-primary-light text-turtle-primary" />
        <CardTitle className="font-semibold text-lg">{title}</CardTitle>
      </CardHeader>
      <CardDescription className="px-4 line-clamp-2">
        {description}
      </CardDescription>
      <CardFooter className="flex h-20 mt-auto">
        <p className="bg-turtle-primary-light py-2 px-3 rounded-full text-turtle-primary border-turtle-primary-border border font-semibold">
          {category}
        </p>
        <ChevronRight className="ml-auto group-hover:translate-x-1" />
      </CardFooter>
    </Card>
  );
};