export default function ConfirmOperation({
  isPending,
  handleOperation,
  setIsPending,
  setWantToContinue,
  label,
  labelPending,
}: {
  label: string;
  labelPending: string;
  isPending: boolean;
  handleOperation: () => Promise<void>;
  setIsPending: (value: boolean) => void;
  setWantToContinue: (value: boolean) => void;
}) {
  return (
    <section className="flex flex-col items-center justify-center fixed inset-0 z-50 w-full h-full">
      <button
        className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-sm"
        onClick={() => setWantToContinue(false)}
      />
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-border bg-card p-5 shadow-[0_8px_22px_rgba(34,32,27,0.04)] sm:p-8 lg:p-10">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md">
          <p>Êtes-vous sûr de vouloir {label.toLowerCase()} ce dossier ?</p>
        </div>

        <div className="flex gap-4">
          <button
            className="btn btn-outline"
            onClick={() => {
              setIsPending(false);
              setWantToContinue(false);
            }}
          >
            Annuler
          </button>

          <button
            className={`btn ${label.toLowerCase().includes("supprimer") ? "btn-destructive" : "btn-primary"} min-h-12 text-sm`}
            onClick={handleOperation}
            disabled={isPending}
          >
            {isPending ? labelPending : label}
          </button>
        </div>
      </div>
    </section>
  );
}
