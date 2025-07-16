import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { generateReadSasUrl, extractBlobNameFromUrl, isBlobUrl } from "@/lib/azure-sas";

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
      where: {
        id: params.cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Generate fresh SAS URL if card has media
    let mediaUrl = null;
    if (card.mediaUrl) {
      try {
        if (isBlobUrl(card.mediaUrl)) {
          // If it's a full blob URL, extract blob name and generate fresh SAS
          const blobName = extractBlobNameFromUrl(card.mediaUrl);
          mediaUrl = generateReadSasUrl(blobName);
        } else {
          // If it's already just a blob name, use it directly
          mediaUrl = generateReadSasUrl(card.mediaUrl);
        }
      } catch (sasError) {
        console.error("[SAS_GENERATION_ERROR]", sasError);
        // Keep original URL as fallback
        mediaUrl = card.mediaUrl;
      }
    }

    const cardWithFreshSas = {
      ...card,
      mediaUrl,
    };

    return NextResponse.json(cardWithFreshSas);
  } catch (error) {
    console.error("[CARDS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}