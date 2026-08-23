import { requestServices } from "@/services/requests.service";
import { NextResponse } from "next/server";

export async function GET() {
  const requests = await requestServices.getRequests();

  return NextResponse.json(requests);
}
