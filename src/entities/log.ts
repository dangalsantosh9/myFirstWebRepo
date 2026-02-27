// src/entities/Log.ts
export type Log = {
  id: number;
  petId: number;
  habitId: number;
  date: string; // ISO-like date string e.g. "2026-02-15"
  note?: string;
};
