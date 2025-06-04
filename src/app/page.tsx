
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
      <DollarSign className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-5xl font-headline font-bold mb-4 text-primary">
        Welcome to FinVerse
      </h1>
      <p className="text-xl text-foreground/80 mb-8 max-w-2xl font-body">
        Your all-in-one solution for budgeting, micro-investing, cryptocurrency tracking, and detailed expense monitoring. Take control of your financial future today.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="font-body">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-body">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
      <p className="mt-12 text-sm text-muted-foreground font-body">
        Already have an account? <Link href="/login" className="text-primary hover:underline">Log in here</Link>.
      </p>
    </div>
  );
}
