import { loginAdmin, logoutAdmin, updateWeddingContent } from "@/actions/wedding";
import { isAdminAuthenticated } from "@/lib/auth";
import { getWeddingContent } from "@/lib/wedding-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
}

interface FieldProps {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
  type?: string;
}

function Field({
  label,
  name,
  defaultValue,
  textarea = false,
  type = "text",
}: FieldProps) {
  const className =
    "mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-stone-700";

  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={4}
          className={className}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          className={className}
        />
      )}
    </label>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();
  const content = await getWeddingContent();

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-100 px-5">
        <form
          action={loginAdmin}
          className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-xl shadow-stone-300/30"
        >
          <h1 className="text-2xl font-semibold text-stone-950">
            Admin Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Enter the wedding editor password.
          </p>
          <label className="mt-6 block text-sm font-medium text-stone-700">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
            />
          </label>
          {params.error ? (
            <p className="mt-3 text-sm text-red-700">Password is incorrect.</p>
          ) : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-stone-900 px-4 py-3 font-semibold text-white transition hover:bg-stone-700"
          >
            Open Editor
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 px-5 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 border-b border-stone-300 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
              Wedding Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Edit invitation</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium transition hover:bg-stone-50"
            >
              View Page
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-lg bg-stone-900 px-4 py-2 font-medium text-white transition hover:bg-stone-700"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        {params.saved ? (
          <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            Saved. The public invitation has been updated.
          </p>
        ) : null}

        <div className="mt-6">
          <form
            action={updateWeddingContent}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Hero title"
                name="heroTitle"
                defaultValue={content.heroTitle}
              />
              <Field
                label="Invitation label"
                name="invitationLabel"
                defaultValue={content.invitationLabel}
              />
              <Field
                label="Groom name"
                name="groomName"
                defaultValue={content.groomName}
              />
              <Field
                label="Bride name"
                name="brideName"
                defaultValue={content.brideName}
              />
              <Field
                label="Event date"
                name="eventDate"
                type="datetime-local"
                defaultValue={content.eventDate}
              />
              <Field
                label="Event display text"
                name="eventTimeLabel"
                defaultValue={content.eventTimeLabel}
              />
              <Field
                label="Venue name"
                name="venueName"
                defaultValue={content.venueName}
              />
              <Field
                label="Venue address"
                name="venueAddress"
                defaultValue={content.venueAddress}
              />
              <Field label="Map URL" name="mapUrl" defaultValue={content.mapUrl} />
              <Field
                label="Music URL (audio file or YouTube)"
                name="musicUrl"
                defaultValue={content.musicUrl}
              />
              <div className="md:col-span-2">
                <Field
                  label="Intro text"
                  name="introText"
                  defaultValue={content.introText}
                  textarea
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Verse"
                  name="verse"
                  defaultValue={content.verse}
                  textarea
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Body text"
                  name="bodyText"
                  defaultValue={content.bodyText}
                  textarea
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Closing text"
                  name="closingText"
                  defaultValue={content.closingText}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
