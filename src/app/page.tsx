import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">
            FlashyCardy
          </h1>
          <p className="text-xl text-muted-foreground">
            Your personal flashcard platform
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="lg">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
