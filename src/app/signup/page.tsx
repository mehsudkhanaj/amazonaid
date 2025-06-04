
import { SignupForm } from "@/components/auth/SignupForm";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-4 sm:p-8">
       <Link href="/" className="mb-8 flex items-center gap-2 text-primary">
        <DollarSign className="h-10 w-10" />
        <span className="text-3xl font-headline font-bold">FinVerse</span>
      </Link>
      <SignupForm />
      <p className="mt-8 text-center text-sm text-muted-foreground font-body">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
