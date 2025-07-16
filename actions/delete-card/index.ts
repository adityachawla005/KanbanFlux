"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "kanbanflux-media";

async function deleteAzureBlobs(urls: string[]): Promise<void> {
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    console.error('Azure Storage connection string not configured');
    return;
  }
  
  if (urls.length === 0) {
    return;
  }
  
  try {
    const { BlobServiceClient } = await import("@azure/storage-blob");
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    
    const validBlobNames: string[] = [];
    
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        if (pathParts.length < 3) {
          continue;
        }
        
        const encodedBlobName = pathParts.slice(2).join('/');
        const blobName = decodeURIComponent(encodedBlobName);
        
        if (blobName && blobName.trim() !== '') {
          validBlobNames.push(blobName);
        }
      } catch (error) {
        continue;
      }
    }
    
    if (validBlobNames.length === 0) {
      return;
    }

    const deletePromises = validBlobNames.map(async (blobName) => {
      try {
        const blobClient = containerClient.getBlobClient(blobName);
        const exists = await blobClient.exists();
        
        if (!exists) {
          return { success: true, blobName, message: 'Blob does not exist' };
        }
        
        await blobClient.delete();
        return { success: true, blobName };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, blobName, error: errorMessage };
      }
    });

    await Promise.allSettled(deletePromises);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Blob deletion failed:', errorMessage);
  }
}

function extractMediaUrls(description: string | null, mediaUrl: string | null): string[] {
  const urls: string[] = [];
  
  if (description) {
    const azureBlobRegex = /https:\/\/[^\/]+\.blob\.core\.windows\.net\/[^\/]+\/[^\s"')\]]+/g;
    const matches = description.match(azureBlobRegex);
    if (matches) {
      urls.push(...matches.map(url => url.trim()).filter(url => url.length > 0));
    }
  }
  
  if (mediaUrl && mediaUrl.includes('blob.core.windows.net')) {
    urls.push(mediaUrl.trim());
  }
  
  return Array.from(new Set(urls));
}

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  
  if (!userId || !orgId) {
    return { error: "Unauthorized." };
  }

  const { id } = data;
  let card;

  try {
    const cardToDelete = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: true,
      },
    });

    if (!cardToDelete) {
      return { error: "Card not found." };
    }

    const mediaUrls = extractMediaUrls(cardToDelete.description, cardToDelete.mediaUrl);

    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: true,
      },
    });

    if (mediaUrls.length > 0) {
      deleteAzureBlobs(mediaUrls).catch(error =>
        console.error('Background blob deletion failed:', error)
      );
    }

    await createAuditLog({
      action: ACTION.DELETE,
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Delete card error:', errorMessage);
    return { error: "Failed to delete card." };
  }

  revalidatePath(`/board/${card.list.boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCardSchema, handler);