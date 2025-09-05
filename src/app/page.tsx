import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            shadcn/ui is Ready! 🎉
          </h1>
          <p className="text-muted-foreground mt-2">
            Your Next.js project is now configured with shadcn/ui components.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Component Demo</CardTitle>
            <CardDescription>
              Here are some shadcn/ui components working in your project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-input">Demo Input</Label>
              <Input id="demo-input" placeholder="Type something here..." />
            </div>
            <div className="flex gap-2">
              <Button>Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">Destructive</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="link" size="sm">Link</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Components</CardTitle>
            <CardDescription>
              Components installed and ready to use:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✅ Button</li>
              <li>✅ Card</li>
              <li>✅ Input</li>
              <li>✅ Label</li>
              <li>✅ Dialog</li>
              <li>✅ Form</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            To add more components, run:{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              npx shadcn@latest add [component-name]
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}
