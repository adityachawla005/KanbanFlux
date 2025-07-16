import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { extractBlobNameFromUrl, generateReadSasUrl, isBlobUrl } from "@/lib/azure-sas";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const card = await db.card.findUnique({
      where: { id: params.cardId },
    });

    if (!card?.mediaUrl) {
      return new NextResponse("No media to refresh", { status: 400 });
    }

    let blobName: string;
    if (isBlobUrl(card.mediaUrl)) {
      blobName = extractBlobNameFromUrl(card.mediaUrl);
    } else {
      blobName = card.mediaUrl;
    }

    const freshUrl = generateReadSasUrl(blobName);

    return NextResponse.json({ mediaUrl: freshUrl });
  } catch (error) {
    console.error("[SAS_REFRESH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
