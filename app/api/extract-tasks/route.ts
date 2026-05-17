import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

const ML_BACKEND = process.env.ML_BACKEND_URL ?? "http://localhost:5001";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let text: string;
  try {
    const body = await req.json();
    text = body.text?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const res = await fetch(`${ML_BACKEND}/extract-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "ML backend error" }));
      return NextResponse.json({ error: err.error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    if (e.name === "TimeoutError") {
      return NextResponse.json({ error: "ML backend timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "ML backend unreachable" }, { status: 503 });
  }
}
