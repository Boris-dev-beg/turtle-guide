import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

type FoldersErrorProps = {
  onRetry?: () => void;
};

export function FoldersError({ onRetry }: FoldersErrorProps) {
  return (
    <div className="flex min-h-70 flex-col items-center justify-center rounded-xl border border-brand-danger/10 bg-brand-danger-bg/50 px-6 py-10 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white">
        <AlertCircle className="size-12 text-brand-danger" strokeWidth={1.8} />
      </div>

      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-brand-ink">
        Impossible de charger vos dossiers
      </h2>

      <p className="mt-2 max-w-md text-sm md:text-base leading-6 text-brand-ink-muted">
        Une erreur est survenue lors de la récupération de vos dossiers.
        Vérifiez votre connexion puis réessayez.
      </p>

      {onRetry && (
        <Button
        variant="outline"
          type="button"
          onClick={onRetry}
          className="btn btn-outline text-base mt-5 rounded-sm p-4"
        >
          <RefreshCw className="size-5" />
          Réessayer
        </Button>
      )}
    </div>
  );
}
