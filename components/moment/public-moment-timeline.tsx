import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MomentLikeButton } from "@/components/moment/moment-like-button";
import type { listPublishedMoments } from "@/lib/moments";

type PublicMomentTimelineProps = {
  moments: Awaited<ReturnType<typeof listPublishedMoments>>;
};

export function PublicMomentTimeline({ moments }: PublicMomentTimelineProps) {
  if (moments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No moments yet</CardTitle>
          <CardDescription>
            Published moments will appear here once you add them from the admin
            panel.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {moments.map((moment) => (
        <article key={moment.id}>
          <Card>
            <CardContent>
              <div
                className="tiptap"
                dangerouslySetInnerHTML={{ __html: moment.content }}
              />
            </CardContent>
            <CardFooter className="flex items-center justify-between py-1.5">
              <p className="text-muted-foreground text-sm">
                {format(moment.publishedAt, "PPP p")}
              </p>
              <MomentLikeButton
                initialLikeCount={moment.likeCount}
                momentId={moment.id}
              />
            </CardFooter>
          </Card>
        </article>
      ))}
    </div>
  );
}
