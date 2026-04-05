"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

interface QuickEditSpotsProps {
  sessionId: string;
  spotsTaken: number;
  capacity: number;
}

export default function QuickEditSpots({ sessionId, spotsTaken, capacity }: QuickEditSpotsProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(spotsTaken);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/sessions/spots", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, spotsTaken: value }),
    });
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={capacity}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-12 bg-white/10 border border-[#f5a623]/50 rounded px-1.5 py-1 text-white text-xs focus:outline-none"
          autoFocus
        />
        <span className="text-white/30 text-xs">/ {capacity}</span>
        <button onClick={save} disabled={saving} className="text-emerald-400 hover:text-emerald-300 p-0.5">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => { setEditing(false); setValue(spotsTaken); }} className="text-red-400 hover:text-red-300 p-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 text-white/70 hover:text-[#f5a623] transition-colors group"
    >
      <span className="font-medium">{spotsTaken}</span>
      <span className="text-white/30">/ {capacity}</span>
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
