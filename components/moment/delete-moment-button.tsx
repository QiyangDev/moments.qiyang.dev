"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type DeleteMomentButtonProps = {
  action: () => Promise<void>;
};

export function DeleteMomentButton({ action }: DeleteMomentButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this moment permanently? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    await action();
    setIsPending(false);
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleDelete}
      size="sm"
      type="button"
      variant="outline"
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
