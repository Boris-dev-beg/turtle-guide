import z from "zod";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function normalizeBirthDate(value: unknown) {
  if (typeof value !== "string") return value;

  const monthFirst = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (monthFirst) {
    const [, month, day, year] = monthFirst;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const yearFirst = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (yearFirst) {
    const [, year, month, day] = yearFirst;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return value;
}

export const requestSchema = z.object({
  docId: z.string().min(1),
  folderId: z.string().min(1),
  data: z.object({
    firstName: z.string().trim().min(2).max(100),
    lastName: z.string().trim().min(2).max(100),
    birthDate: z.preprocess(
      normalizeBirthDate,
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide.")
        .refine((value) => {
          const [year, month, day] = value.split("-").map(Number);
          const date = new Date(Date.UTC(year, month - 1, day));
          return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
          );
        }, "Date de naissance invalide."),
    ),
    birthPlace: z.string().trim().min(2).max(150),
    fatherName: z.string().trim().max(150).optional().default(""),
    motherName: z.string().trim().max(150).optional().default(""),
  }),
});

export function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Douala",
  }).format(new Date(`${value}T12:00:00`));
}

export function getPurpose(answers: { question: string; answer: string }[]) {
  return answers.find(({ question }) =>
    /usage|utilisation|motif|pour quel/i.test(question),
  )?.answer;
}
