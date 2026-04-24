"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";

import { AuthForm, type AuthMode } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AuthDialog() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const isSignUp = mode === "sign-up";

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        <LogIn data-icon="inline-start" />
        Sign in
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Sign up with your name, email, and password."
              : "Sign in with the email and password you registered with."}
          </DialogDescription>
        </DialogHeader>
        <AuthForm mode={mode} onModeChange={setMode} redirectTo="/" />
      </DialogContent>
    </Dialog>
  );
}
