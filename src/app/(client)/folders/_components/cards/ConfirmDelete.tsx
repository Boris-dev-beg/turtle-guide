export default function ConfirmDelete({
  isDeleting,
  handleDelete,
  setIsDeleting,
  setWantToDelete,
}: {
  isDeleting: boolean;
  handleDelete: () => Promise<void>;
  setIsDeleting: (value: boolean) => void;
  setWantToDelete: (value: boolean) => void;
}) {
  return (
    <section className="flex flex-col items-center justify-center fixed inset-0 z-50 bg-black/30 backdrop-blur-sm w-full h-full">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-border bg-card p-5 shadow-[0_8px_22px_rgba(34,32,27,0.04)] sm:p-8 lg:p-10">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md">
          <p>Êtes-vous sûr de vouloir supprimer ce dossier ?</p>
        </div>

        <div className="flex gap-4">
          <button
            className="btn btn-outline"
            onClick={() => {
              setIsDeleting(false);
              setWantToDelete(false);
            }}
          >
            Annuler
          </button>

          <button
            className="btn btn-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </section>
  );
}
