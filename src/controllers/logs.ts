// src/controllers/logs.ts
import { Request, Response } from 'express';
import { Log } from '../entities/log.js';
import { habits } from '../models/habits.js';
import { logIdCounter, logs } from '../models/logs.js';
import { pets } from '../models/pets.js';
import { computePetStage } from '../utils/petStage.js';
import { CreateLogSchema } from '../validators/logs.js';

function parsePetId(req: Request): number {
  return Number(req.params.petId);
}

function clamp0to100(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function createLog(req: Request, res: Response): void {
  const petId = parsePetId(req);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  if (computePetStage(pet).isCooked) {
    res.status(400).json({ message: 'This pet has been cooked. Adopt a new one.' });
    return;
  }

  const bodyResult = CreateLogSchema.safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).json(bodyResult.error);
    return;
  }

  const habit = habits.find((h) => h.id === bodyResult.data.habitId);

  // Must exist AND belong to this pet. :contentReference[oaicite:6]{index=6}
  if (!habit || habit.petId !== petId) {
    res.status(400).json({ message: 'Habit does not belong to this pet' });
    return;
  }

  // Boost pet stat +10, clamp at 100. :contentReference[oaicite:7]{index=7}
  if (habit.statBoost === 'happiness') {
    pet.happiness = clamp0to100(pet.happiness + 10);
  } else if (habit.statBoost === 'hunger') {
    pet.hunger = clamp0to100(pet.hunger + 10);
  } else {
    pet.energy = clamp0to100(pet.energy + 10);
  }

  // Reset neglect timer
  pet.lastFedAt = new Date();

  const newLog: Log = {
    id: logIdCounter.value++,
    petId,
    habitId: bodyResult.data.habitId,
    date: bodyResult.data.date,
    note: bodyResult.data.note,
  };

  logs.push(newLog);
  res.status(201).json(newLog);
}
