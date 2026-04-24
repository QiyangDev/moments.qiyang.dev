"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteMomentButtonProps = {
  action: () => Promise<void>;
};

export function DeleteMomentButton({ action }: DeleteMomentButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    setIsPending(true);
    await action();
    setIsPending(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            disabled={isPending}
            size="sm"
            type="button"
            variant="destructive"
          />
        }
      >
        <Trash2 data-icon="inline-start" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete moment?</AlertDialogTitle>
          <AlertDialogDescription>
            This moment will be permanently deleted. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} variant="ghost">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            variant="destructive"
          >
            <Trash2 data-icon="inline-start" />
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
