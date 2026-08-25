import { icons } from "@/data/GlobalData";
import { Blocks, MoreHorizontal, Unlink, Users } from "lucide-react";

export const RightIcon = ({
  title,
  category,
  className,
}: {
  title?: string;
  category: string;
  className?: string;
}) => {
  const Icon = category.includes("toutes")
    ? Blocks
    : category.includes("civil") && title?.includes("naissance")
      ? icons["civil"]
      : category.includes("civil") && title?.includes("nationalité")
        ? icons["nationalité"]
        : category.includes("civil") && title?.includes("mariage")
          ? icons["mariage"]
          : category.includes("civil") && title?.includes("décès")
            ? icons["deces"]
            : category.includes("civil")
              ? Users
              : category.includes("documents")
                ? icons["documents"]
                : category.includes("famille")
                  ? icons["famille"]
                  : category.includes("logement")
                    ? icons["logement"]
                    : category.includes("emploi")
                      ? icons["emploi"]
                      : category.includes("éducation")
                        ? icons["éducation"]
                        : category.includes("justice")
                          ? icons["justice"]
                          : category.includes("santé")
                            ? icons["santé"]
                            : category.includes("transport")
                              ? icons["transport"]
                              : category.includes("autres")
                                ? MoreHorizontal
                                : Unlink;
  return (
    <Icon
      className={
        className
          ? className
          : "size-12 min-w-12 p-2 rounded-md bg-turtle-primary-light text-turtle-primary"
      }
    />
  );
};
