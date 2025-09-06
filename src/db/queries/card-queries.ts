import { db } from "@/db";
import { cardsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { getUserDeckById } from "./deck-queries";

// Zod schemas for validation
export const CreateCardSchema = z.object({
  deckId: z.number().positive(),
  front: z.string().min(1, "Front text is required"),
  back: z.string().min(1, "Back text is required"),
});

export const UpdateCardSchema = z.object({
  id: z.number().positive(),
  front: z.string().min(1, "Front text is required"),
  back: z.string().min(1, "Back text is required"),
});

export const DeleteCardSchema = z.object({
  id: z.number().positive(),
});

// Types derived from Zod schemas
export type CreateCardData = z.infer<typeof CreateCardSchema>;
export type UpdateCardData = z.infer<typeof UpdateCardSchema>;
export type DeleteCardData = z.infer<typeof DeleteCardSchema>;

// Query functions for data retrieval
export async function getUserCards(deckId: number, userId: string) {
  try {
    // Verify deck ownership before returning cards
    const deck = await getUserDeckById(deckId, userId);
    if (!deck) {
      throw new Error("Deck not found or unauthorized");
    }

    return await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));
  } catch (error) {
    console.error("Failed to fetch user cards:", error);
    throw error;
  }
}

export async function getUserCardById(cardId: number, userId: string) {
  try {
    const card = await db.query.cardsTable.findFirst({
      where: eq(cardsTable.id, cardId),
      with: {
        deck: true
      }
    });

    if (!card || card.deck.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }

    return card;
  } catch (error) {
    console.error("Failed to fetch card by ID:", error);
    throw error;
  }
}

// Mutation functions for data modifications
export async function createCard(data: CreateCardData, userId: string) {
  const validatedData = CreateCardSchema.parse(data);
  
  try {
    // Verify deck ownership before creating card
    const deck = await getUserDeckById(validatedData.deckId, userId);
    if (!deck) {
      throw new Error("Deck not found or unauthorized");
    }

    const [newCard] = await db
      .insert(cardsTable)
      .values(validatedData)
      .returning();

    return newCard;
  } catch (error) {
    console.error("Failed to create card:", error);
    throw error;
  }
}

export async function updateCard(data: UpdateCardData, userId: string) {
  const validatedData = UpdateCardSchema.parse(data);
  
  try {
    // First verify the card exists and belongs to the user
    const existingCard = await getUserCardById(validatedData.id, userId);
    if (!existingCard) {
      throw new Error("Card not found or unauthorized");
    }

    const [updatedCard] = await db
      .update(cardsTable)
      .set({
        front: validatedData.front,
        back: validatedData.back,
        updatedAt: new Date(),
      })
      .where(eq(cardsTable.id, validatedData.id))
      .returning();

    return updatedCard;
  } catch (error) {
    console.error("Failed to update card:", error);
    throw error;
  }
}

export async function deleteCard(data: DeleteCardData, userId: string) {
  const validatedData = DeleteCardSchema.parse(data);
  
  try {
    // First verify the card exists and belongs to the user
    const existingCard = await getUserCardById(validatedData.id, userId);
    if (!existingCard) {
      throw new Error("Card not found or unauthorized");
    }

    const [deletedCard] = await db
      .delete(cardsTable)
      .where(eq(cardsTable.id, validatedData.id))
      .returning();

    return deletedCard;
  } catch (error) {
    console.error("Failed to delete card:", error);
    throw error;
  }
}
