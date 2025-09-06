import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <main className="container mx-auto px-8 py-16 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-4">
            <div className="text-6xl font-bold text-muted-foreground mb-2">404</div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
          </div>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered an incorrect URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
