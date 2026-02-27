// src/controllers/habits.ts
import { Request, Response } from 'express';
import { Habit } from '../entities/Habit.js';
import { habitIdCounter, habits } from '../models/habits.js';
import { pets } from '../models/pets.js';
import { computePetStage } from '../utils/petStage.js';
import { CreateHabitSchema } from '../validators/habits.js';

function parsePetId(req: Request): number {
  return Number(req.params.petId);
}

export function createHabit(req: Request, res: Response): void {
  const petId = parsePetId(req);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  // If cooked, block creating habits. :contentReference[oaicite:5]{index=5}
  if (computePetStage(pet).isCooked) {
    res.status(400).json({ message: 'This pet has been cooked. Adopt a new one.' });
    return;
  }

  const result = CreateHabitSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }

  const newHabit: Habit = {
    id: habitIdCounter.value++,
    petId,
    name: result.data.name,
    category: result.data.category,
    targetFrequency: result.data.targetFrequency,
    statBoost: result.data.statBoost,
  };

  habits.push(newHabit);
  res.status(201).json(newHabit);
}

export function listHabits(req: Request, res: Response): void {
  const petId = parsePetId(req);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  const category = req.query.category as string | undefined;

  let filtered = habits.filter((h) => h.petId === petId);
  if (category) {
    filtered = filtered.filter((h) => h.category === category);
  }

  res.status(200).json(filtered);
}
