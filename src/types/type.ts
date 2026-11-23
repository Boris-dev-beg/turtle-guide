import type {
  AdminCategoryRow,
  CategoryInput,
} from "@/lib/schemas/category.schema";
import type { AdminProcedureRow, ProcedureInput } from "@/lib/schemas/procedure.schema";

// ! Admin categories
export type { AdminCategoryRow, CategoryInput };
export type CategorySortKey = "name" | "slug" | "procedureCount" | "status";
export type CategoryStatusFilter = "all" | "active" | "inactive";

// ! Admin procedures
export type { AdminProcedureRow, ProcedureInput };
export type ProcedireSortKey = "title" | "legalBasis" | "questionCount" | "status";
export type ProcedureStatusFilter = "all" | "active" | "inactive";

export type user = {
  name?: string;
  phone: string;
};
