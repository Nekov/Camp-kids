import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { bg } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, fmt = "d MMM yyyy") {
  return format(new Date(date), fmt, { locale: bg });
}

export function formatDateRange(start: Date | string, end: Date | string) {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = format(s, "d MMM", { locale: bg });
  const endStr = format(e, "d MMM yyyy", { locale: bg });
  return `${startStr} – ${endStr}`;
}

export function getProgressColor(pct: number): "green" | "yellow" | "red" {
  if (pct < 50) return "green";
  if (pct < 80) return "yellow";
  return "red";
}

export function getProgressLabel(pct: number): string {
  if (pct < 50) return "Свободни места";
  if (pct < 80) return "Запълва се";
  return "Почти пълно";
}

export function spotsRemaining(capacity: number, taken: number) {
  return Math.max(0, capacity - taken);
}

export function fillPercent(capacity: number, taken: number) {
  return Math.min(100, Math.round((taken / capacity) * 100));
}

export function timeAgoText(date: Date | null): string | null {
  if (!date) return null;
  const hoursAgo = differenceInHours(new Date(), date);
  if (hoursAgo < 1) return "преди малко";
  if (hoursAgo < 24) return `преди ${hoursAgo} час${hoursAgo === 1 ? "" : "а"}`;
  const daysAgo = differenceInDays(new Date(), date);
  return `преди ${daysAgo} ден`;
}

export function countdownToDate(target: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} {
  const now = new Date();
  const t = new Date(target);
  const diff = t.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export function formatPrice(amount: number): string {
  return `€${amount.toLocaleString("de-DE", { minimumFractionDigits: 0 })}`;
}
