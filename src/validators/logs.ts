// src/validators/logs.ts
import { z } from 'zod';

export const CreateLogSchema = z.object({
  habitId: z.number().int('habitId must be an integer'),
  date: z
    .string()
    .min(1, 'date is required')
    // spec examples show "YYYY-MM-DD" style
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format'),
  note: z.string().max(200, 'note must be 200 characters or less').optional(),
});

export type CreateLogBody = z.infer<typeof CreateLogSchema>;
