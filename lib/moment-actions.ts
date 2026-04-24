"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createMoment,
  deleteMoment,
  getMomentById,
  incrementMomentLikeCount,
  updateMoment,
} from "@/lib/moments";
import type { MomentFormState } from "@/components/moment/home-moment-composer";
import { stripMomentHtml } from "@/lib/moment-content";
import { requireSession } from "@/lib/session";

type ParsedMomentFormData =
  | {
      error: string;
    }
  | {
      data: {
        content: string;
        publishedAt: Date;
        isPublished: boolean;
      };
    };

function parseMomentFormData(formData: FormData): ParsedMomentFormData {
  const content = String(formData.get("content") ?? "").trim();
  const contentText = stripMomentHtml(content);

  if (!contentText) {
    return { error: "Content is required." } as const;
  }

  return {
    data: {
      content,
      publishedAt: new Date(),
      isPublished: true,
    },
  } as const;
}

export async function createMomentAction(
  _state: MomentFormState,
  formData: FormData,
): Promise<MomentFormState> {
  await requireSession();

  const parsed = parseMomentFormData(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  await createMoment(parsed.data);
  revalidatePath("/");
  redirect("/");
}

export async function updateMomentAction(
  id: string,
  _state: MomentFormState,
  formData: FormData,
): Promise<MomentFormState> {
  await requireSession();

  const existing = await getMomentById(id);

  if (!existing) {
    return { error: "This moment no longer exists." };
  }

  const parsed = parseMomentFormData(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  await updateMoment(id, parsed.data);
  revalidatePath("/");
  redirect("/");
}

export async function deleteMomentAction(id: string) {
  await requireSession();
  await deleteMoment(id);
  revalidatePath("/");
}

export async function likeMomentAction(id: string) {
  const moment = await incrementMomentLikeCount(id);

  if (!moment) {
    return {
      error: "This moment is no longer available.",
    } as const;
  }

  revalidatePath("/");

  return {
    likeCount: moment.likeCount,
  } as const;
}
