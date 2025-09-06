"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { 
  createCard, 
  updateCard, 
  deleteCard,
  type CreateCardData,
  type UpdateCardData,
  type DeleteCardData
} from "@/db/queries/card-queries";

export async function createCardAction(data: CreateCardData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use mutation helper function instead of direct database access
  const newCard = await createCard(data, userId);

  // Revalidate both dashboard and the specific deck page
  revalidatePath("/dashboard");
  revalidatePath(`/decks/${data.deckId}`);
  return newCard;
}

export async function updateCardAction(data: UpdateCardData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use mutation helper function
  const updatedCard = await updateCard(data, userId);

  // Revalidate both dashboard and the specific deck page
  revalidatePath("/dashboard");
  revalidatePath(`/decks/${updatedCard.deckId}`);
  return updatedCard;
}

export async function deleteCardAction(data: DeleteCardData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use mutation helper function
  const deletedCard = await deleteCard(data, userId);

  // Revalidate both dashboard and the specific deck page
  revalidatePath("/dashboard");
  revalidatePath(`/decks/${deletedCard.deckId}`);
  return deletedCard;
}
