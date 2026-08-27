export default function page() {
  return (
    <div className="flex flex-col gap-4 p-4 border-border bg-background shadow-xs shadow-muted-foreground">
      <div className="flex flex-col">
        <h1 className="text-2xl text-brand-green-text font-bold">
          Créer un compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Remplissez les informations ci-dessous pour créer votre compte.
        </p>
      </div>
    </div>
  );
}
