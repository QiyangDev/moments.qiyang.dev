import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { getSession } from "@/lib/session";

function getSafeRedirectTarget(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const { next } = await searchParams;
  const redirectTo = getSafeRedirectTarget(next);

  if (session) {
    redirect(redirectTo);
  }

  return <AuthForm mode="sign-up" redirectTo={redirectTo} />;
}
