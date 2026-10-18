import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  const content = (
    <button type="button" onClick={onAction} className="btn btn-outline">
      {actionLabel}
    </button>
  );

  return (
    <div className="flex min-h-48 w-full items-center justify-center rounded-[1.125rem] border border-border bg-card p-6 text-center">
      <div className="max-w-md space-y-3">
        <h3 className="font-display text-[1.6rem] leading-tight text-brand-ink">
          {title}
        </h3>

        <p className="text-sm leading-6 text-brand-ink-muted">{description}</p>

        {actionLabel &&
          (onAction ? (
            content
          ) : actionHref ? (
            <Link href={actionHref} className="btn btn-outline">
              {actionLabel}
            </Link>
          ) : null)}
      </div>
    </div>
  );
}
