// src/entities/Habit.ts
export type Habit = {
  id: number;
  petId: number;
  name: string;
  category: 'health' | 'fitness' | 'mindfulness' | 'learning' | 'social';
  targetFrequency: number; // 1-7
  statBoost: 'happiness' | 'hunger' | 'energy';
};
