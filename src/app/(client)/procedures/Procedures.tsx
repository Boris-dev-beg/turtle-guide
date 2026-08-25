"use client";
import { Procedure_card } from "@/app/(client)/_components/Procedures/Procedures.card";
import { useProcedures } from "@/hooks/useProcedures";
import { useEffect, useState } from "react";
import {
  CardLoading,
  FoundedProceduces,
} from "../_components/Procedures/Cards";
import { FilterForm } from "../_components/Procedures/Form";
import { Categories } from "./Categories";
import { useCategories } from "@/hooks/useCategories";

// ? Normalize the value
const deleteAccent = (text: string) => {
  return text
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export function Procedures_Zone() {
  // ! States
  const { categories, loading: categoryLoading } = useCategories();
  const { procedures, loading } = useProcedures();
  const [proceduresToShow, setProceduresToShow] = useState(procedures);
  const [procedureNotFound, setProcedureNotFound] = useState(false);

  // ! Functions
  // ? Update Procedure To Show
  useEffect(() => {
    const updateProcedureToShow = () => {
      setProceduresToShow(procedures);
    };
    updateProcedureToShow();
  }, [procedures]);

  // ? Filter Procedures
  const filter = (searchElt: string) => {
    if (searchElt.trim() === "" || searchElt.trim().includes("toutes") || searchElt.trim().includes("Autres")) {
      setProceduresToShow(procedures);
      setProcedureNotFound(false);
      return;
    }

    // ? Normalization of the user's Entry
    const search = deleteAccent(searchElt.trim());

    const FilteredProcedures = procedures.filter((procedure) => {
      // ? Normalization of the fields I need
      const safeTitle = deleteAccent(procedure.title);
      const safeCategoryName = deleteAccent(procedure.category.name);

      if (safeTitle.includes(search) || safeCategoryName.includes(search)) {
        return true;
      } else {
        return false;
      }
    });

    if (FilteredProcedures.length === 0) {
      setProcedureNotFound(true);
      return;
    } else {
      setProcedureNotFound(false);
      setProceduresToShow(FilteredProcedures);
      return;
    }
  };

  // ! Render
  return (
    <div className="h-full flex flex-col py-5 gap-5">
      {/* HEADER */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-turtle-primary max-w-xl lg:max-w-2xl">
          Quelle démarche souhaitez-vous effectuer ?
        </h1>
        <FilterForm filter={(elt) => filter(elt)} />
      </div>
      {/* BODY */}
      <main className="flex gap-3 border-t border-turtle-border pt-4">
        {/* Category filter */}
        <Categories
          OnClick={(elt) => filter(elt)}
          categories={categories}
          loading={categoryLoading}
        />
        {/* Cards */}
        <div className="flex flex-col gap-4 w-full">
          <FoundedProceduces loading={loading} length={procedures.length} />
          {procedureNotFound ? (
            <ProceduresNotFound />
          ) : (
            <Procedures loading={loading} procedures={proceduresToShow} />
          )}
        </div>
      </main>
    </div>
  );
}

export function Procedures({
  procedures,
  loading,
}: {
  procedures: {
    title: string;
    description: string;
    category: {
      name: string;
    };
  }[];
  loading: boolean;
}) {

  // ! Render
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-md:w-full gap-4">
      {loading ? (
        <>
          <CardLoading />
          <CardLoading />
          <CardLoading />
          <CardLoading />
        </>
      ) : (
        <>
          {procedures.map((proc, index) => (
            <Procedure_card key={index} procedure={proc} />
          ))}
        </>
      )}
    </div>
  );
}

const ProceduresNotFound = () => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center w-full h-full min-h-50">
      <h1 className="font-semibold text-2xl">Oops, Procédure non trouvée</h1>
      <p className="text-turtle-text-muted">
        Désoler votre procedure n&apos;a pas étè trouvée
      </p>
    </div>
  );
};
