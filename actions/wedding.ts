"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveWeddingContent, type WeddingContent } from "@/lib/wedding-data";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  passwordMatches,
} from "@/lib/auth";

function readRequired(formData: FormData, key: keyof WeddingContent) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!passwordMatches(password)) {
    redirect("/admin?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function updateWeddingContent(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=auth");
  }

  const content: WeddingContent = {
    heroTitle: readRequired(formData, "heroTitle"),
    introText: readRequired(formData, "introText"),
    invitationLabel: readRequired(formData, "invitationLabel"),
    verse: readRequired(formData, "verse"),
    bodyText: readRequired(formData, "bodyText"),
    groomName: readRequired(formData, "groomName"),
    brideName: readRequired(formData, "brideName"),
    eventDate: readRequired(formData, "eventDate"),
    eventTimeLabel: readRequired(formData, "eventTimeLabel"),
    venueName: readRequired(formData, "venueName"),
    venueAddress: readRequired(formData, "venueAddress"),
    mapUrl: readRequired(formData, "mapUrl"),
    closingText: readRequired(formData, "closingText"),
    musicUrl: readRequired(formData, "musicUrl"),
  };

  await saveWeddingContent(content);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}
