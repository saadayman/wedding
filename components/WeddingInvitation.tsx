"use client";

import { useEffect, useRef, useState } from "react";
import type { WeddingContent } from "@/lib/wedding-data";

interface WeddingInvitationProps {
  content: WeddingContent;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownCardProps {
  label: string;
  value: number;
}

function getTimeLeft(eventDate: string): TimeLeft {
  const diff = Math.max(new Date(eventDate).getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function getEventDateParts(eventDate: string) {
  const [datePart] = eventDate.split("T");
  const [year, month, day] = datePart.split("-");
  const monthName = ARABIC_MONTHS[Number(month) - 1] ?? "الموعد";

  return {
    day: day ? day.padStart(2, "0") : "--",
    month: monthName,
    year: year ?? "",
  };
}

function getYoutubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (!host.endsWith("youtube.com")) {
      return null;
    }

    const videoParam = parsedUrl.searchParams.get("v");
    if (videoParam) {
      return videoParam;
    }

    const [type, id] = parsedUrl.pathname.split("/").filter(Boolean);
    if (["embed", "shorts", "live"].includes(type)) {
      return id ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

function getYoutubeEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    enablejsapi: "1",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function CountdownCard({ label, value }: CountdownCardProps) {
  const currentValue = pad(value);

  return (
    <div
      className="countdown-card"
      aria-label={`${currentValue} ${label}`}
    >
      <div className="countdown-value" aria-hidden="true">
        {currentValue}
      </div>
      <span className="sr-only">
        {currentValue} {label}
      </span>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

export function WeddingInvitation({ content }: WeddingInvitationProps) {
  const [musicOn, setMusicOn] = useState(Boolean(content.musicUrl));
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(content.eventDate));
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubeRef = useRef<HTMLIFrameElement>(null);
  const eventDateParts = getEventDateParts(content.eventDate);
  const youtubeVideoId = getYoutubeVideoId(content.musicUrl);
  const youtubeEmbedUrl = youtubeVideoId
    ? getYoutubeEmbedUrl(youtubeVideoId)
    : null;
  const audioUrl = youtubeVideoId ? "" : content.musicUrl;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(content.eventDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [content.eventDate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) {
      return;
    }

    if (musicOn) {
      audio.play().catch(() => setMusicOn(false));
    } else {
      audio.pause();
    }
  }, [audioUrl, musicOn]);

  useEffect(() => {
    const iframe = youtubeRef.current;
    if (!iframe || !youtubeEmbedUrl) {
      return;
    }

    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: musicOn ? "playVideo" : "pauseVideo",
        args: [],
      }),
      "https://www.youtube.com",
    );
  }, [musicOn, youtubeEmbedUrl]);

  const countdown = [
    {
      label: "يوم",
      value: timeLeft.days,
    },
    {
      label: "ساعة",
      value: timeLeft.hours,
    },
    {
      label: "دقيقة",
      value: timeLeft.minutes,
    },
    {
      label: "ثانية",
      value: timeLeft.seconds,
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-[100svh] overflow-x-hidden bg-[#16110f] p-3 text-[#fff7ee] selection:bg-[#cf9f6d]/40 sm:p-4"
    >
      {audioUrl ? (
        <audio ref={audioRef} src={audioUrl} autoPlay loop preload="auto" />
      ) : null}
      {youtubeEmbedUrl ? (
        <iframe
          ref={youtubeRef}
          src={youtubeEmbedUrl}
          title="Wedding music"
          allow="autoplay; encrypted-media"
          onLoad={() => {
            if (musicOn) {
              youtubeRef.current?.contentWindow?.postMessage(
                JSON.stringify({
                  event: "command",
                  func: "playVideo",
                  args: [],
                }),
                "https://www.youtube.com",
              );
            }
          }}
          className="pointer-events-none fixed bottom-0 left-0 h-px w-px opacity-0"
        />
      ) : null}

      <div className="invite-ambient pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(213,164,106,0.34),transparent_24%),radial-gradient(circle_at_18%_78%,rgba(126,61,64,0.32),transparent_24%),linear-gradient(135deg,#2b201b,#16110f_62%,#0d0b0a)]" />
      <div className="invite-sparkles pointer-events-none fixed inset-0" />

      <section className="invite-shell relative mx-auto min-h-[calc(100svh-1.5rem)] max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#251a16] shadow-2xl shadow-black/35 sm:min-h-[calc(100svh-2rem)]">
        <div className="invite-panel relative flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden bg-[#251a16] px-5 py-5 text-white sm:min-h-[calc(100svh-2rem)] sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(218,177,122,0.26),transparent_26%),linear-gradient(160deg,rgba(255,255,255,0.09),transparent_38%)]" />
          <div className="invite-glow-line absolute inset-x-8 top-7 h-px bg-gradient-to-l from-transparent via-[#e7c28b]/70 to-transparent" />
          <div className="invite-glow-line invite-glow-line-slow absolute inset-x-8 bottom-7 h-px bg-gradient-to-l from-transparent via-[#e7c28b]/40 to-transparent" />

          {content.musicUrl ? (
            <nav className="motion-reveal motion-delay-1 absolute inset-x-5 top-5 z-20 flex items-center justify-end text-xs font-bold text-white/74 sm:inset-x-7 lg:inset-x-9">
              <button
                type="button"
                onClick={() => setMusicOn((value) => !value)}
                className="motion-button rounded-full border border-white/14 bg-white/8 px-4 py-2 transition hover:bg-white/14"
              >
                {musicOn ? "إيقاف الصوت" : "تشغيل الصوت"}
              </button>
            </nav>
          ) : null}

          <div className="relative z-10 grid flex-1 content-center gap-3 py-14 text-center sm:gap-4">
            <div className="motion-reveal motion-delay-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.36em] text-[#e7c28b]">
                {content.invitationLabel}
              </p>
              <p className="mt-1 text-sm leading-7 text-white/64 sm:text-base">
                {content.heroTitle}
              </p>
              <h1 className="invite-names mx-auto mt-3 grid w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 text-center font-serif text-white">
                <span className="name-word min-w-0 whitespace-nowrap">
                  {content.groomName}
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#e7c28b]/45 bg-[#e7c28b]/10 text-[clamp(1.35rem,2vw,2rem)] leading-none text-[#e7c28b]">
                  &
                </span>
                <span className="name-word min-w-0 whitespace-nowrap">
                  {content.brideName}
                </span>
              </h1>
            </div>

            <p className="motion-reveal motion-delay-4 mx-auto max-w-3xl text-[clamp(0.95rem,1.35vw,1.12rem)] leading-8 text-white/74">
              {content.bodyText}
            </p>

            <p className="motion-reveal motion-delay-5 invite-verse mx-auto max-w-3xl border-y border-white/12 py-3 text-[clamp(0.95rem,1.35vw,1.16rem)] leading-9 text-[#f2dcc2]">
              &quot;{content.verse}&quot;
            </p>

            <div className="motion-reveal motion-delay-6 countdown-shell mx-auto w-full max-w-3xl">
              <div className="countdown-heading" aria-hidden="true">
                <span />
                <p>الوقت المتبقي</p>
                <span />
              </div>
              <div className="countdown-grid">
                {countdown.map(({ label, value }) => (
                  <CountdownCard
                    key={label}
                    label={label}
                    value={value}
                  />
                ))}
              </div>
            </div>

            <div className="motion-reveal motion-delay-7 mx-auto grid w-full max-w-3xl gap-1.5 rounded-2xl border border-white/10 bg-white/[0.045] p-1.5 text-start shadow-xl shadow-black/10 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_auto] sm:items-center">
              <div className="min-w-0 rounded-xl bg-black/10 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e7c28b]">
                  Save The Date
                </p>
                <p className="mt-0.5 truncate text-base font-bold text-white">
                  {eventDateParts.day} {eventDateParts.month} {eventDateParts.year}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-white/58">
                  {content.eventTimeLabel}
                </p>
              </div>

              <div className="min-w-0 rounded-xl bg-black/10 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e7c28b]">
                  Ceremony Place
                </p>
                <p className="mt-0.5 truncate text-base font-bold text-white">
                  {content.venueName}
                </p>
                <p className="mt-0.5 truncate text-xs leading-5 text-white/56">
                  {content.venueAddress}
                </p>
              </div>

              <a
                href={content.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="motion-button flex h-11 items-center justify-center rounded-xl bg-[#e7c28b] px-4 text-sm font-bold text-[#2b211d] transition hover:bg-[#f7d69e] sm:min-w-32"
              >
                افتح الخريطة
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
