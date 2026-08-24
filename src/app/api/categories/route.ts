import { categoriesServices } from "@/services/categories.service";
import { NextResponse } from "next/server";

export async function GET() {
  const respones = await categoriesServices.getAll();

  return NextResponse.json(respones);
}
