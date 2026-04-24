"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
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

export function AuthForm({ mode, onModeChange, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
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

    if (response.error) {
      setIsPending(false);
      setErrorMessage(getErrorMessage(response.error));
      return;
    }

    startTransition(() => {
      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

      <Button aria-busy={isPending} disabled={isPending} type="submit">
        {isPending ? <Spinner /> : null}
        {isPending
          ? isSignUp
            ? "Creating account..."
            : "Signing in..."
          : isSignUp
            ? "Create account"
            : "Sign in"}
      </Button>

      {onModeChange ? (
        <p className="text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Button
            className="h-auto px-0"
            onClick={() => {
              setErrorMessage(null);
              onModeChange(isSignUp ? "sign-in" : "sign-up");
            }}
            type="button"
            variant="link"
          >
            {isSignUp ? "Sign in" : "Create one"}
          </Button>
        </p>
      ) : null}
    </form>
  );
}
