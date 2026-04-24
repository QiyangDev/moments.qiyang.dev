"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  redirectTo: string;
};

type AuthError = {
  code?: string;
  message?: string | null;
};

function getErrorMessage(error: AuthError | null | undefined) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "USER_ALREADY_EXISTS":
      return "An account with this email already exists.";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "The email or password is incorrect.";
    case "INVALID_PASSWORD":
      return "Password must be at least 8 characters long.";
    default:
      return error.message ?? "Something went wrong. Please try again.";
  }
}

export function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrorMessage(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    const response = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name,
        })
      : await authClient.signIn.email({
          email,
          password,
        });

    setIsPending(false);

    if (response.error) {
      setErrorMessage(getErrorMessage(response.error));
      return;
    }

    startTransition(() => {
      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create your account" : "Welcome back"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Sign up with your name, email, and password."
              : "Sign in with the email and password you registered with."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="flex flex-col gap-5">
            {isSignUp ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  autoComplete="name"
                  id="name"
                  name="name"
                  placeholder="Ada Lovelace"
                  required
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete={isSignUp ? "new-password" : "current-password"}
                id="password"
                minLength={8}
                name="password"
                placeholder="At least 8 characters"
                required
                type="password"
              />
            </div>

            {errorMessage ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <Button disabled={isPending} type="submit">
              {isPending
                ? isSignUp
                  ? "Creating account..."
                  : "Signing in..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </Button>

            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <Link
                className="font-medium text-foreground underline-offset-4 hover:underline"
                href={
                  isSignUp
                    ? `/sign-in?next=${encodeURIComponent(redirectTo)}`
                    : `/sign-up?next=${encodeURIComponent(redirectTo)}`
                }
              >
                {isSignUp ? "Sign in" : "Create one"}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
