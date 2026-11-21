import type {
  AdminCategoryRow,
  CategoryInput,
} from "@/lib/schemas/category.schema";

export type { AdminCategoryRow, CategoryInput };
export type CategorySortKey = "name" | "slug" | "procedureCount" | "status";
export type CategoryStatusFilter = "all" | "active" | "inactive";
