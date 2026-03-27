"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function generateFingerprint(): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("HisVoice", 2, 2);
  }
  const canvasData = canvas.toDataURL();

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset().toString(),
    canvasData.slice(0, 100),
  ].join("|");

  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "hv_" + Math.abs(hash).toString(36);
}

function getUrlParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const identifiedRef = useRef(false);

  // Identify visitor on mount
  useEffect(() => {
    if (identifiedRef.current) return;
    identifiedRef.current = true;

    const fingerprint = generateFingerprint();

    fetch("/api/tracking/identify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fingerprint,
        browser: navigator.userAgent.includes("Chrome")
          ? "Chrome"
          : navigator.userAgent.includes("Firefox")
            ? "Firefox"
            : navigator.userAgent.includes("Safari")
              ? "Safari"
              : "Other",
        os: navigator.platform,
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        screenRes: `${screen.width}x${screen.height}`,
        language: navigator.language,
        referrer: document.referrer || null,
        utmSource: getUrlParam("utm_source"),
        utmMedium: getUrlParam("utm_medium"),
        utmCampaign: getUrlParam("utm_campaign"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        sessionIdRef.current = data.sessionId;
      })
      .catch(() => {});
  }, []);

  // Track page views
  useEffect(() => {
    if (!sessionIdRef.current || !pathname) return;

    const timer = setTimeout(() => {
      fetch("/api/tracking/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          path: pathname,
          title: document.title,
        }),
      }).catch(() => {});
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
