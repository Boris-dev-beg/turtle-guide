import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <span>
          <h1 className="text-2xl font-bold">Tableau de Bord</h1>
          <p>Vue d&apos;ensemble de la plateforme</p>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Ouvrir le calendrier"
                className="flex min-w-0 items-center gap-2 rounded-full text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-3 sm:pr-2 bg-white shadow-sm cursor-pointer p-2"
              />
            }
          >
            <span className="flex gap-2 items-center">
              <Calendar
                className="hidden size-6 text-brand-ink-muted sm:block"
                aria-hidden="true"
              />
              <span className="block max-w-36 truncate text-base font-semibold text-brand-ink">
                30 Derniers jours
              </span>
              <ChevronDown
                className="hidden size-6 text-brand-ink-muted sm:block"
                aria-hidden="true"
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-65 p-5 gap-4 flex flex-col"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <button className="block truncate font-medium text-brand-ink text-base cursor-pointer">
                  60 Derniers jours
                </button>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
