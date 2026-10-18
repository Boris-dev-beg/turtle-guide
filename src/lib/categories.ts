"use server";
import { categoriesServices } from "@/services/categories.service";

export async function getAll() {
  return await categoriesServices.getAll();
}
