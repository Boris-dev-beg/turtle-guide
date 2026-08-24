import { proceduresServices } from "@/services/procedure.service";
import { NextResponse } from "next/server";

export async function GET() {
  const requests = await proceduresServices.getAll();

  return NextResponse.json(requests);
}
