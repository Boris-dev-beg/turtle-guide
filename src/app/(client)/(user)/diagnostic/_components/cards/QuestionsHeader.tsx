
export default function QuestionsHeader({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-sm bg-brand-yellow-bg px-3 py-1.5 text-sm font-semibold text-brand-ink">
            Question {currentIndex + 1}
          </span>
          <span className="h-4 w-px bg-border" />
          <h2 className="text-muted-foreground text-sm font-medium">
            Diagnostic en cours
          </h2>
        </div>
      </div>

  )
}
