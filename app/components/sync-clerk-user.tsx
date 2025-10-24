"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SyncClerkUser() {
  const { user, isLoaded } = useUser();
  const ensureUser = useMutation(api.functions.users.ensureUser);

  useEffect(() => {
    // Only run after Clerk user is fully loaded
    if (!isLoaded || !user) return;

    const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const provider =
      user.externalAccounts?.[0]?.provider ?? "unknown";

    // Call Convex mutation to ensure user record exists
    ensureUser({
      clerkId: user.id,
      email: primaryEmail,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      username: user.username ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
      provider,
    }).catch((err) => {
      console.error("Error syncing user to Convex:", err);
    });
  }, [user, isLoaded, ensureUser]);

  return null; // No UI
}
