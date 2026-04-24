import { format } from "date-fns";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteMomentButton } from "@/components/moment/delete-moment-button";
import { MomentLikeButton } from "@/components/moment/moment-like-button";
import { deleteMomentAction } from "@/lib/moment-actions";
import type { listPublishedMoments } from "@/lib/moments";

type PublicMomentTimelineProps = {
  currentUserId?: string;
  moments: Awaited<ReturnType<typeof listPublishedMoments>>;
};

export function PublicMomentTimeline({
  currentUserId,
  moments,
}: PublicMomentTimelineProps) {
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
      {moments.map((moment) => {
        const publisherName = moment.author?.name ?? "Unknown publisher";
        const publisherInitials =
          publisherName
            .split(" ")
            .map((namePart) => namePart.at(0))
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?";
        const canDelete = currentUserId === moment.authorId;

        return (
          <article key={moment.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    {moment.author?.image ? (
                      <AvatarImage
                        alt={publisherName}
                        src={moment.author.image}
                      />
                    ) : null}
                    <AvatarFallback>{publisherInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle>{publisherName}</CardTitle>
                    <CardDescription>
                      {format(moment.publishedAt, "PPP p")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="tiptap"
                  dangerouslySetInnerHTML={{ __html: moment.content }}
                />
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-2 py-1.5">
                <div>
                  {canDelete ? (
                    <DeleteMomentButton
                      action={deleteMomentAction.bind(null, moment.id)}
                    />
                  ) : null}
                </div>
                <MomentLikeButton
                  initialLikeCount={moment.likeCount}
                  momentId={moment.id}
                />
              </CardFooter>
            </Card>
          </article>
        );
      })}
    </div>
  );
}
