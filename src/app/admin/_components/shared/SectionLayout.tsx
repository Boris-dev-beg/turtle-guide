export default function SectionLayout({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-ink">
            {title}
          </h1>
          <p className="mt-1 text-sm text-brand-ink-muted sm:text-base">
            {subtitle}
          </p>
        </div>

        <>{action}</>
      </div>
      <>{children}</>
    </div>
  );
}
