"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  
  if (!userId || !orgId) {
    return { error: "Unauthorized." };
  }

  const { title, listId, mediaUrl, mediaType } = data;

  try {
    const list = await db.list.findUnique({
      where: { id: listId },
      include: {
        board: true,
        cards: {
          orderBy: { order: "desc" },
        },
      },
    });

    if (!list || list.board.orgId !== orgId) {
      return { error: "List not found or not part of your organization." };
    }

    const newOrder = list.cards[0]?.order ? list.cards[0].order + 1 : 1;

    // Build the card data object conditionally
    const baseCardData = {
      title,
      listId,
      order: newOrder,
    };

    // Type assertion to work with Prisma's strict types
    const cardData = {
      ...baseCardData,
      ...(mediaUrl && mediaUrl.trim() !== "" && { mediaUrl }),
      ...(mediaType && { mediaType }),
    } as any;

    const card = await db.card.create({
      data: cardData,
    });

    await createAuditLog({
      action: ACTION.CREATE,
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
    });

    revalidatePath(`/board/${list.board.id}`);
    return { data: card };
  } catch (error) {
    console.error("Error creating card:", error);
    return { error: "Failed to create card." };
  }
};

export const createCard = createSafeAction(CreateCardSchema, handler);