import { db } from "@/db";
import { decksTable, cardsTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

// Zod schemas for validation
export const CreateDeckSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export const UpdateDeckSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).nullable().optional(),
});

export const DeleteDeckSchema = z.object({
  id: z.number().positive(),
});

// Types derived from Zod schemas
export type CreateDeckData = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckData = z.infer<typeof UpdateDeckSchema>;
export type DeleteDeckData = z.infer<typeof DeleteDeckSchema>;

// Query functions for data retrieval
export async function getUserDecks(userId: string) {
  try {
    return await db
      .select()
      .from(decksTable)
      .where(eq(decksTable.userId, userId))
      .orderBy(desc(decksTable.createdAt));
  } catch (error) {
    console.error("Failed to fetch user decks:", error);
    throw error;
  }
}

export async function getUserDecksWithCards(userId: string) {
  try {
    return await db.query.decksTable.findMany({
      where: eq(decksTable.userId, userId),
      with: {
        cards: {
          orderBy: [desc(cardsTable.updatedAt)],
        },
      },
      orderBy: [desc(decksTable.createdAt)],
    });
  } catch (error) {
    console.error("Failed to fetch user decks with cards:", error);
    throw error;
  }
}

export async function getDeckWithCards(deckId: number, userId: string) {
  try {
    const deck = await db.query.decksTable.findFirst({
      where: and(
        eq(decksTable.id, deckId),
        eq(decksTable.userId, userId) // MANDATORY user check
      ),
      with: {
        cards: {
          orderBy: [desc(cardsTable.updatedAt)],
        },
      },
    });

    if (!deck) {
      throw new Error("Deck not found or unauthorized");
    }

    return deck;
  } catch (error) {
    console.error("Failed to fetch deck with cards:", error);
    throw error;
  }
}

export async function getUserDeckById(deckId: number, userId: string) {
  try {
    return await db.query.decksTable.findFirst({
      where: and(
        eq(decksTable.id, deckId),
        eq(decksTable.userId, userId)
      ),
    });
  } catch (error) {
    console.error("Failed to fetch deck by ID:", error);
    throw error;
  }
}

// Mutation functions for data modifications
export async function createDeck(data: CreateDeckData, userId: string) {
  const validatedData = CreateDeckSchema.parse(data);
  
  try {
    const [newDeck] = await db
      .insert(decksTable)
      .values({
        ...validatedData,
        userId,
      })
      .returning();

    return newDeck;
  } catch (error) {
    console.error("Failed to create deck:", error);
    throw error;
  }
}

export async function updateDeck(data: UpdateDeckData, userId: string) {
  const validatedData = UpdateDeckSchema.parse(data);
  
  try {
    const [updatedDeck] = await db
      .update(decksTable)
      .set({
        title: validatedData.title,
        description: validatedData.description ?? null,
        updatedAt: new Date(),
      })
      .where(and(
        eq(decksTable.id, validatedData.id),
        eq(decksTable.userId, userId) // MANDATORY ownership check
      ))
      .returning();

    if (!updatedDeck) {
      throw new Error("Deck not found or unauthorized");
    }

    return updatedDeck;
  } catch (error) {
    console.error("Failed to update deck:", error);
    throw error;
  }
}

export async function deleteDeck(data: DeleteDeckData, userId: string) {
  const validatedData = DeleteDeckSchema.parse(data);
  
  try {
    const [deletedDeck] = await db
      .delete(decksTable)
      .where(and(
        eq(decksTable.id, validatedData.id),
        eq(decksTable.userId, userId) // MANDATORY ownership check
      ))
      .returning();

    if (!deletedDeck) {
      throw new Error("Deck not found or unauthorized");
    }

    return deletedDeck;
  } catch (error) {
    console.error("Failed to delete deck:", error);
    throw error;
  }
}
