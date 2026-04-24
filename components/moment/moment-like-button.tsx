"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { likeMomentAction } from "@/lib/moment-actions";

type MomentLikeButtonProps = {
  momentId: string;
  initialLikeCount: number;
};

export function MomentLikeButton({
  momentId,
  initialLikeCount,
}: MomentLikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleLike() {
    if (isPending) {
      return;
    }

    const previousLikeCount = likeCount;
    setError(null);
    setLikeCount(previousLikeCount + 1);

    startTransition(async () => {
      const result = await likeMomentAction(momentId);

      if ("error" in result) {
        setLikeCount(previousLikeCount);
        setError(result.error ?? "Unable to save your like right now.");
        return;
      }

      setLikeCount(result.likeCount);
    });
  }

  return (
    <div className="flex items-center">
      <Button
        aria-label="Like this moment"
        disabled={isPending}
        onClick={handleLike}
        type="button"
        variant="outline"
      >
        <Heart className="size-4" />
        <span>{likeCount}</span>
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
