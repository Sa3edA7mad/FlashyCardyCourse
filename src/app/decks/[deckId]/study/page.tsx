import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getDeckWithCards } from "@/db/queries/deck-queries";
import { StudyInterface } from "@/components/StudyInterface";

interface StudyPageProps {
  params: {
    deckId: string;
  };
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  const deckId = parseInt(params.deckId);
  
  // Validate deckId parameter
  if (isNaN(deckId) || deckId <= 0) {
    notFound();
  }

  // Fetch deck with cards using helper function (includes user authorization)
  let deck;
  try {
    deck = await getDeckWithCards(deckId, userId);
  } catch (error) {
    console.error("Failed to fetch deck:", error);
    notFound();
  }

  if (!deck) {
    notFound();
  }

  // Redirect back to deck page if no cards to study
  if (deck.cards.length === 0) {
    redirect(`/decks/${deckId}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <StudyInterface deck={deck} />
    </main>
  );
}
