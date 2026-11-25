"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAdminProcedures } from "@/hooks/useAdminProcedures";
import { AdminProcedureRow, ProcedureInput } from "@/types/type";
import { useProcedureList } from "@/hooks/useProcedureList";
import { SubSectionHeaders } from "../common/SubSectionHeaders";
import DataFilters from "../common/DataFilters";
import ProcedureTable from "../tables/ProcedureTable";
import ProcedureFormDialog from "../Dialogs/ProcedureFormDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";
import type { ProcedureCategoryOption } from "../Dialogs/ProcedureFields";

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function ProceduresManager({
  procedures,
  categories,
}: {
  procedures: AdminProcedureRow[];
  categories: ProcedureCategoryOption[];
}) {
  const [editingProcedure, setEditingProcedure] =
    useState<AdminProcedureRow | null>(null);
  const [deletingProcedure, setDeletingProcedure] =
    useState<AdminProcedureRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const { createProcedure, updateProcedure, deleteProcedure, isSaving, isDeleting } =
    useAdminProcedures();
  const {
    query,
    status,
    sortKey,
    sortDescending,
    filteredProcedure,
    setQuery,
    setStatus,
    toggleSort,
  } = useProcedureList(procedures);

  const openForm = (procedure: AdminProcedureRow | null) => {
    setEditingProcedure(procedure);
    setFormError("");
    setFormKey((key) => key + 1);
    setFormOpen(true);
  };

  const saveProcedure = async (input: ProcedureInput) => {
    setFormError("");
    try {
      const message = editingProcedure
        ? await updateProcedure({ id: editingProcedure.id, input })
        : await createProcedure(input);
      setFormOpen(false);
      setNotice(message);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "L'enregistrement a échoué.",
      );
    }
  };

  const removeProcedure = async () => {
    if (!deletingProcedure) return;
    try {
      setNotice(await deleteProcedure(deletingProcedure.id));
      setDeletingProcedure(null);
      setDeleteError("");
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "La suppression a échoué.",
      );
    }
  };

  return (
    <div className="space-y-5">
      <SubSectionHeaders
        notice={notice}
        onCreate={() => openForm(null)}
        onDismissNotice={() => setNotice("")}
        label="procédure"
        subLabel=""
      />

      <Card className="overflow-hidden rounded-md gap-0 shadow-none ring-border">
        <DataFilters
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          label="Rechercher une Procédure"
        />
        <ProcedureTable
          procedures={filteredProcedure}
          emptyMessage={procedures.length === 0 ? "Aucune procédure n'est enregistrée." : "Aucune procédure ne correspond à ces filtres."}
          sortKey={sortKey}
          sortDescending={sortDescending}
          onSort={toggleSort}
          onEdit={openForm}
          onDelete={(procedure) => {
            setDeletingProcedure(procedure);
            setDeleteError("");
          }}
        />
        <div className="border-t border-border px-4 py-3 text-sm text-brand-ink-muted">
          {formatCount(filteredProcedure.length)} résultat
          {filteredProcedure.length === 1 ? "" : "s"} sur{" "}
          {formatCount(procedures.length)}
        </div>
      </Card>

      <ProcedureFormDialog
        key={formKey}
        open={formOpen}
        procedure={editingProcedure}
        categories={categories}
        pending={isSaving}
        error={formError}
        onOpenChange={setFormOpen}
        onSubmit={saveProcedure}
      />
      <DeleteDialog
        name={deletingProcedure?.title as string}
        label="procédure"
        element={deletingProcedure}
        pending={isDeleting}
        error={deleteError}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProcedure(null);
            setDeleteError("");
          }
        }}
        onConfirm={removeProcedure}
      />
    </div>
  );
}
