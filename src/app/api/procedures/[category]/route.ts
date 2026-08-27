import { proceduresServices } from "@/services/procedure.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;
  const response = await proceduresServices.getByCategory(
    decodeURIComponent(category),
  );
  
  return NextResponse.json(response);
}
