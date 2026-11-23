import { getAdminProcedures } from "@/lib/procedures";
import SectionLayout from "../../_components/shared/SectionLayout";
import { ListTree } from "lucide-react";
import ProceduresManager from "../_components/sections/proceduresManager";

export default async function page() {
  const result = await getAdminProcedures();
  if (!result.authorized) {
    return (
      <p
        role="alert"
        className="rounded-md border border-border bg-card p-5 text-brand-ink"
      >
        Connectez-vous pour accéder à la gestion des procédures.
      </p>
    );
  }
 const procedures = result.procedures;
 
   return (
     <SectionLayout
       title="Procédures"
       subtitle=""
       action={
         <span className="hidden items-center gap-2 text-sm text-brand-ink-muted sm:inline-flex">
           <ListTree className="size-4" aria-hidden="true" />
           {procedures.length} procédure{procedures.length === 1 ? "" : "s"}
         </span>
       }
     >
       <ProceduresManager procedures={procedures} />
     </SectionLayout>
   );
}
