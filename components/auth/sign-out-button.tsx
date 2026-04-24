"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);

    const { error } = await authClient.signOut();

    setIsPending(false);

    if (error) {
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <Button disabled={isPending} onClick={handleSignOut} variant="outline">
      {isPending ? <LoaderCircle className="animate-spin" /> : <LogOut />}
      <span className="sr-only">
        {isPending ? "Signing out..." : "Sign out"}
      </span>
    </Button>
  );
}
