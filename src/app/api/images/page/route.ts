// src/app/api/images/page/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMyImagesPage }          from "~/server/queries";
import { auth }                     from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  // 1️⃣ Authenticate
  const { userId } = await auth();              // ← make sure you `await`!
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2️⃣ Parse pagination params
  const { searchParams } = new URL(req.url);
  const limit  = Number(searchParams.get("limit")  ?? "20");
  const cursor = searchParams.get("cursor")
               ? Number(searchParams.get("cursor")!)
               : null;

  // 3️⃣ Delegate to your helper *with* userId
  const data = await getMyImagesPage({ userId, limit, cursor });

  return NextResponse.json(data);
}
