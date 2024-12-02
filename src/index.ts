import 'dotenv/config';
import express, { Express } from 'express';
import modules from './modules/index.js';
import { GameManager } from './engine/GameManager.ts';
import { GameMode } from './types/game/state.type.ts';

const app: Express = express();

await modules(app);

const CKEY = process.env.CKEY as string;
const MODE = GameMode.Sandbox; // Adjust as needed

if (!CKEY) {
  throw new Error('CKEY is not set in environment variables.');
}

(async () => {
  try {

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.debug(`Server running on http://localhost:${PORT}`);
    });

    const gameManager = new GameManager(CKEY, MODE);
    await gameManager.initialize();
    await gameManager.start();

  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
})();
