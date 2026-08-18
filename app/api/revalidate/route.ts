import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation secret is not configured" },
      { status: 500 },
    );
  }

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Invalid secret" },
      { status: 401 },
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
  });
}