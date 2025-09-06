"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { 
  createDeck, 
  updateDeck, 
  deleteDeck,
  type CreateDeckData,
  type UpdateDeckData,
  type DeleteDeckData
} from "@/db/queries/deck-queries";

export async function createDeckAction(data: CreateDeckData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use mutation helper function instead of direct database access
  const newDeck = await createDeck(data, userId);

  revalidatePath("/dashboard");
  return newDeck;
}

export async function updateDeckAction(data: UpdateDeckData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use mutation helper function
  const updatedDeck = await updateDeck(data, userId);

  revalidatePath("/dashboard");
  revalidatePath(`/decks/${data.id}`);
  return updatedDeck;
}

export async function deleteDeckAction(data: DeleteDeckData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use mutation helper function
  await deleteDeck(data, userId);

  revalidatePath("/dashboard");
}
