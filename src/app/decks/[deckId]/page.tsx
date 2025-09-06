import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDeckWithCards } from "@/db/queries/deck-queries";
import { AddCardDialog } from "@/components/AddCardDialog";
import { DeleteCardDialog } from "@/components/DeleteCardDialog";
import { DeleteDeckDialog } from "@/components/DeleteDeckDialog";
import { EditDeckDialog } from "@/components/EditDeckDialog";
import { EditCardDialog } from "@/components/EditCardDialog";

interface DeckPageProps {
  params: {
    deckId: string;
  };
}

export default async function DeckPage({ params }: DeckPageProps) {
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

  return (
    <main className="container mx-auto p-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {deck.title}
          </h1>
          {deck.description?.trim() && (
            <p className="text-lg text-muted-foreground">
              {deck.description.trim()}
            </p>
          )}
        </div>

        {/* Deck Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <strong className="text-foreground mr-1">{deck.cards.length}</strong> 
            {deck.cards.length === 1 ? 'card' : 'cards'}
          </span>
          <span>
            Created: <strong className="text-foreground">{new Date(deck.createdAt).toLocaleDateString()}</strong>
          </span>
          <span>
            Last updated: <strong className="text-foreground">{new Date(deck.updatedAt).toLocaleDateString()}</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {deck.cards.length > 0 ? (
          <Link href={`/decks/${deckId}/study`}>
            <Button size="lg">
              Study Mode
            </Button>
          </Link>
        ) : (
          <Button size="lg" disabled>
            Study Mode
          </Button>
        )}
        <EditDeckDialog 
          deckId={deckId} 
          currentTitle={deck.title}
          currentDescription={deck.description}
          cardCount={deck.cards.length}
        />
        <AddCardDialog deckId={deckId} />
        <DeleteDeckDialog 
          deckId={deckId} 
          deckTitle={deck.title}
          cardCount={deck.cards.length}
        />
      </div>

      {/* Cards Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Cards in this deck
        </h2>
        
        {deck.cards.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This deck doesn't have any cards yet. Add your first card to get started!
                </p>
                <AddCardDialog deckId={deckId}>
                  <Button>
                    Add First Card
                  </Button>
                </AddCardDialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deck.cards.map((card, index) => (
              <Card key={card.id} className="hover:shadow-md transition-shadow">
                <CardContent className="space-y-4 p-6">
                  {/* Front of Card */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Front:</div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{card.front}</p>
                    </div>
                  </div>
                  
                  {/* Back of Card */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Back:</div>
                    <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                      <p className="text-sm">{card.back}</p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2 pt-2">
                    <EditCardDialog 
                      cardId={card.id} 
                      currentFront={card.front}
                      currentBack={card.back}
                    >
                      <Button variant="ghost" size="sm" className="flex-1 border">
                        Edit
                      </Button>
                    </EditCardDialog>
                    <DeleteCardDialog cardId={card.id} cardIndex={index} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Study Progress Card */}
      {deck.cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Study?</CardTitle>
            <CardDescription>
              Practice your flashcards with our interactive study mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link href={`/decks/${deckId}/study`}>
                <Button>
                  Start Studying
                </Button>
              </Link>
              <Link href={`/decks/${deckId}/study`}>
                <Button variant="outline">
                  Quick Review
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
