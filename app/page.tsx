import { PlusSquare } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { HomeMomentComposer } from "@/components/moment/home-moment-composer";
import { PublicMomentTimeline } from "@/components/moment/public-moment-timeline";
import { createMomentAction } from "@/lib/moment-actions";
import { listPublishedMoments } from "@/lib/moments";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();
  const moments = await listPublishedMoments();

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-16">
      <section className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Moments</h1>
            <p className="text-sm text-muted-foreground">
              {session
                ? `Signed in as ${session.user.name}.`
                : "Sign in to create a new moment."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <SignOutButton />
            ) : (
              <AuthDialog />
            )}
            <ModeToggle />
          </div>
        </div>

        {session ? (
          <HomeMomentComposer action={createMomentAction} />
        ) : (
          <div className="rounded-2xl border border-dashed px-5 py-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <PlusSquare className="size-4" />
              <span>Only signed-in users can create new moments.</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <PublicMomentTimeline
            currentUserId={session?.user.id}
            moments={moments}
          />
        </div>
      </section>
    </main>
  );
}
