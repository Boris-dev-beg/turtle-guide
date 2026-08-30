
export default function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="w-full border-b border-border/60 bg-secondary/40">
      <div className="wrapper flex min-h-30 items-center py-4 sm:min-h-34 lg:min-h-26">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {title}
          </h1>

          <p className="text-sm leading-6 text-muted-foreground sm:text-base lg:text-lg">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}