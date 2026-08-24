import { ListFilter } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { InputDemo, SelectDemo } from "@/components/shared/inputs";
import { Categories } from "./Categories";
import { FoundedProceduces, Procedures } from "./Procedures";

export default function page() {
  return (
    <section className="flex flex-col h-full w-full">
      <div className="h-full flex flex-col py-5 gap-5">
        {/* HEADER */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-turtle-primary max-w-xl lg:max-w-2xl">
            Quelle démarche souhaitez-vous effectuer ?
          </h1>
          <div className="flex flex-col lg:flex-row justify-between gap-3">
            <p className="text-turtle-slate">
              Choississez la procédure qui correspond à votre besoin.
            </p>
            <InputDemo className="lg:w-100 lg:ml-auto" />

            <InputGroup className="lg:hidden py-5 w-fit focus-within:ring-turtle-primary-border! focus-within:border-none!">
              <InputGroupAddon>
                <ListFilter className="size-5" />
              </InputGroupAddon>
              <SelectDemo />
            </InputGroup>
          </div>
        </div>
        {/* BODY */}
        <main className="flex gap-3 border-t border-turtle-border pt-4">
          {/* Category filter */}
          <Categories />
          {/* Cards */}
          <div className="flex flex-col gap-4 w-full">
            <FoundedProceduces />
            <Procedures />
          </div>
        </main>
      </div>
    </section>
  );
}
