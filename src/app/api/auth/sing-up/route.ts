import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  const response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  return NextResponse.json(response, { status: 200 });
}
