// src/utils/petStage.ts
import { differenceInMilliseconds } from 'date-fns';
import { Pet } from '../entities/Pet.js';
import { logs } from '../models/logs.js';
import { NEGLECT_THRESHOLD_MS } from './config.js';

export type PetStage = {
  stage: 'Egg' | 'Hatching' | 'Growing' | 'Grown' | 'Cooked';
  stageEmoji: '🥚' | '🐣' | '🐥' | '🐓' | '🍗';
  isCooked: boolean;
};

export function getTotalLogsForPet(petId: number): number {
  return logs.filter((l) => l.petId === petId).length;
}

export function computePetStage(pet: Pet): PetStage {
  const msSinceFed = differenceInMilliseconds(new Date(), pet.lastFedAt);

  // Check neglect FIRST (cooked overrides growth). :contentReference[oaicite:3]{index=3}
  if (msSinceFed > NEGLECT_THRESHOLD_MS) {
    return { stage: 'Cooked', stageEmoji: '🍗', isCooked: true };
  }

  const totalLogs = getTotalLogsForPet(pet.id);

  if (totalLogs === 0) return { stage: 'Egg', stageEmoji: '🥚', isCooked: false };
  if (totalLogs >= 1 && totalLogs <= 4)
    return { stage: 'Hatching', stageEmoji: '🐣', isCooked: false };
  if (totalLogs >= 5 && totalLogs <= 14)
    return { stage: 'Growing', stageEmoji: '🐥', isCooked: false };
  return { stage: 'Grown', stageEmoji: '🐓', isCooked: false };
}

export function toPetResponse(pet: Pet) {
  const { stage, stageEmoji } = computePetStage(pet);
  return {
    ...pet,
    // Dates become ISO strings automatically in JSON, that’s fine for responses
    stage,
    stageEmoji,
  };
}
