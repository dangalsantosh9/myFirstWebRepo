import { Request, Response } from 'express';
import { Pet } from '../entities/Pet.js';
import { petIdCounter, pets } from '../models/pets.js';
import { toPetResponse } from '../utils/petStage.js';
import { CreatePetSchema, UpdatePetSchema } from '../validators/pets.js';

function parsePetId(req: Request): number {
  return Number(req.params.petId);
}

// CREATE PET
export function createPet(req: Request, res: Response): void {
  const result = CreatePetSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }

  const newPet: Pet = {
    id: petIdCounter.value++,
    name: result.data.name,
    species: result.data.species,
    happiness: 50,
    hunger: 50,
    energy: 50,
    lastFedAt: new Date(),
  };

  pets.push(newPet);

  // IMPORTANT: use toPetResponse so stage is included
  res.status(201).json(toPetResponse(newPet));
}

// LIST PETS
export function listPets(req: Request, res: Response): void {
  const species = req.query.species as string | undefined;
  const minHappinessRaw = req.query.minHappiness as string | undefined;

  let filtered = pets.slice();

  if (species) {
    filtered = filtered.filter((p) => p.species === species);
  }

  if (minHappinessRaw !== undefined) {
    const minHappiness = Number(minHappinessRaw);

    if (!Number.isFinite(minHappiness)) {
      res.status(400).json({ message: 'minHappiness must be a number' });
      return;
    }

    filtered = filtered.filter((p) => p.happiness >= minHappiness);
  }

  res.status(200).json(filtered.map(toPetResponse));
}

// GET SINGLE PET
export function getPet(req: Request, res: Response): void {
  const petId = parsePetId(req);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.status(200).json(toPetResponse(pet));
}

// UPDATE PET NAME
export function updatePetName(req: Request, res: Response): void {
  const petId = parsePetId(req);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  const result = UpdatePetSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }

  pet.name = result.data.name;

  res.status(200).json(toPetResponse(pet));
}

// DELETE PET
export function deletePet(req: Request, res: Response): void {
  const petId = parsePetId(req);
  const index = pets.findIndex((p) => p.id === petId);

  if (index === -1) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  pets.splice(index, 1);

  res.status(204).send();
}
