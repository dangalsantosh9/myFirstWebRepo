// src/entities/Pet.ts
export type Pet = {
  id: number;
  name: string;
  species: 'cat' | 'dragon' | 'blob' | 'plant' | 'rock';
  happiness: number; // 0-100
  hunger: number; // 0-100
  energy: number; // 0-100
  lastFedAt: Date;
};
