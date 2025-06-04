
import { LoginForm } from "@/components/auth/LoginForm";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-4 sm:p-8">
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary">
        <DollarSign className="h-10 w-10" />
        <span className="text-3xl font-headline font-bold">FinVerse</span>
      </Link>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted-foreground font-body">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
