import { categoriesServices } from "@/services/categories.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  requests: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const respones = await categoriesServices.getOne(id);

  return NextResponse.json(respones);
}
