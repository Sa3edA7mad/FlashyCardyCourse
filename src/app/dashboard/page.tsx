import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserDecksWithCards } from "@/db/queries/deck-queries";
import { CreateDeckDialog } from "@/components/CreateDeckDialog";
import { EditDeckDialog } from "@/components/EditDeckDialog";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  // Fetch user's decks with cards using helper function
  const decksWithCardCounts = await getUserDecksWithCards(userId);

  return (
    <main className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your FlashyCardy dashboard
        </p>
      </div>

      {/* Your Decks Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Your Decks
          </h2>
          <CreateDeckDialog />
        </div>
        
        {decksWithCardCounts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  No decks created yet. Start by creating your first flashcard deck!
                </p>
                <CreateDeckDialog>
                  <Button>
                    Create Your First Deck
                  </Button>
                </CreateDeckDialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decksWithCardCounts.map((deck: any) => (
              <Card key={deck.id} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="line-clamp-1 h-6">{deck.title}</CardTitle>
                  <CardDescription className="line-clamp-2 h-10">
                    {deck.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="space-y-2 flex-grow">
                    <div className="flex justify-between text-sm h-5">
                      <span className="text-muted-foreground">Cards:</span>
                      <span className="font-medium">{deck.cards.length}</span>
                    </div>
                    <div className="flex justify-between text-sm h-5">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(deck.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm h-5">
                      <span className="text-muted-foreground">Last update:</span>
                      <span className="font-medium">
                        {new Date(deck.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2 flex-shrink-0">
                    <Link href={`/decks/${deck.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Study Deck
                      </Button>
                    </Link>
                    <EditDeckDialog
                      deckId={deck.id}
                      currentTitle={deck.title}
                      currentDescription={deck.description}
                      cardCount={deck.cards.length}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Deck
                      </Button>
                    </EditDeckDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Study Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>
            Track your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-2xl font-bold text-foreground">
              {decksWithCardCounts.length} {decksWithCardCounts.length === 1 ? 'Deck' : 'Decks'}
            </div>
            <div className="text-sm text-muted-foreground">
              {decksWithCardCounts.reduce((total: number, deck: any) => total + deck.cards.length, 0)} Total Cards
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
