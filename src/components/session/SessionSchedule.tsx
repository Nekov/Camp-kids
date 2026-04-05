"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Day {
  day: number;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
}

interface SessionScheduleProps {
  schedule: { days: Day[] };
}

export default function SessionSchedule({ schedule }: SessionScheduleProps) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-5">Програма ден по ден</h2>
      <div className="space-y-2">
        {schedule.days.map((day) => (
          <div
            key={day.day}
            className="rounded-xl bg-[#1e3a52]/40 border border-white/10 overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#f5a623]/20 text-[#f5a623] text-xs font-bold flex items-center justify-center shrink-0">
                  {day.day}
                </span>
                <div>
                  <span className="text-white font-semibold text-sm">Ден {day.day}</span>
                  <span className="text-white/50 text-xs ml-2">— {day.theme}</span>
                </div>
              </div>
              <ChevronDown
                className={cn("w-4 h-4 text-white/50 transition-transform shrink-0", openDay === day.day && "rotate-180")}
              />
            </button>

            {openDay === day.day && (
              <div className="px-4 pb-4 space-y-2 border-t border-white/5">
                {[
                  { time: "🌅 Сутрин", text: day.morning },
                  { time: "☀️ Следобед", text: day.afternoon },
                  { time: "🌙 Вечер", text: day.evening },
                ].map(({ time, text }) => (
                  <div key={time} className="flex gap-3 pt-2">
                    <span className="text-xs text-white/40 shrink-0 w-24">{time}</span>
                    <span className="text-white/70 text-xs leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
