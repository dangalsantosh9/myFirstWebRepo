// src/index.ts
import 'dotenv/config';
import express, { Express } from 'express';

import { createHabit, listHabits } from './controllers/habits.js';
import { createLog } from './controllers/logs.js';
import { createPet, deletePet, getPet, listPets, updatePetName } from './controllers/pets.js';

const app: Express = express();

app.use(express.json());

// --- Routes ---
app.post('/pets', createPet);
app.get('/pets', listPets);
app.get('/pets/:petId', getPet);
app.put('/pets/:petId', updatePetName);
app.delete('/pets/:petId', deletePet);

app.post('/pets/:petId/habits', createHabit);
app.get('/pets/:petId/habits', listHabits);

app.post('/pets/:petId/logs', createLog);
// --- Routes ---

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Tender listening on http://localhost:${PORT}`);
});
