"use client";

import { Heart } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

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
  const pendingLikeCountRef = useRef(0);
  const latestBatchIdRef = useRef(0);
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flushLikes() {
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
      flushTimeoutRef.current = null;
    }

    const likeAmount = pendingLikeCountRef.current;

    if (likeAmount < 1) {
      return;
    }

    pendingLikeCountRef.current = 0;
    latestBatchIdRef.current += 1;
    const batchId = latestBatchIdRef.current;

    startTransition(async () => {
      try {
        const result = await likeMomentAction(momentId, likeAmount);

        if ("error" in result) {
          setLikeCount((currentLikeCount) => currentLikeCount - likeAmount);
          setError(result.error ?? "Unable to save your like right now.");
          return;
        }

        if (
          pendingLikeCountRef.current === 0 &&
          batchId === latestBatchIdRef.current
        ) {
          setLikeCount(result.likeCount);
        }
      } catch {
        setLikeCount((currentLikeCount) => currentLikeCount - likeAmount);
        setError("Unable to save your like right now.");
      }
    });
  }

  function scheduleFlush() {
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }

    flushTimeoutRef.current = setTimeout(flushLikes, 700);
  }

  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
    };
  }, []);

  function handleLike() {
    setError(null);
    pendingLikeCountRef.current += 1;
    setLikeCount((currentLikeCount) => currentLikeCount + 1);
    scheduleFlush();
  }

  return (
    <div className="flex items-center">
      <Button
        aria-label="Like this moment"
        aria-busy={isPending}
        onClick={handleLike}
        type="button"
        variant="outline"
        className="font-mono"
      >
        <Heart data-icon="inline-start" />
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
