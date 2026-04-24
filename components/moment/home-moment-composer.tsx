"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";

import { RichTextEditor } from "@/components/moment/rich-text-editor";
import { Button } from "@/components/ui/button";

export type MomentFormState = {
  error: string | null;
};

type HomeMomentComposerProps = {
  action: (
    state: MomentFormState,
    formData: FormData,
  ) => Promise<MomentFormState>;
};

const initialState: MomentFormState = {
  error: null,
};

function ComposerSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {!pending && <Plus className="size-4" />}
      {pending ? "Saving..." : "Create"}
    </Button>
  );
}

export function HomeMomentComposer({ action }: HomeMomentComposerProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <RichTextEditor
        id="content"
        name="content"
        placeholder="Write your moment here."
        required
        toolbarEnd={<ComposerSubmitButton />}
        value=""
      />

      {state.error ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
