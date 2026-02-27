// src/validators/habits.ts
import { z } from 'zod';

export const CreateHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  category: z.enum(['health', 'fitness', 'mindfulness', 'learning', 'social']),
  targetFrequency: z.number().int('targetFrequency must be an integer').min(1).max(7),
  statBoost: z.enum(['happiness', 'hunger', 'energy']),
});

export type CreateHabitBody = z.infer<typeof CreateHabitSchema>;
