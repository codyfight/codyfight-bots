import dotenv from 'dotenv';
dotenv.config();

import { GameMode } from './types/game/state.type.js'
import CBot from './engine/CBot.js'
import botsConfig from './config/bots-config.js';
import { getEnvVar } from './utils/utils.js'

const BOT_RETRIES = parseInt(getEnvVar('BOT_RETRIES'));

type BotConfig = {
  ckey: string;
  mode: GameMode;
};

/**
 * Retry a function with a specified number of attempts.
 *
 * @param {() => Promise<T>} runBot - The function to execute.
 * @returns {Promise<T>} The resolved value of the function.
 * @throws {Error} If all retry attempts fail.
 */
const retry = async <T>(runBot: () => Promise<T>): Promise<T> => {
  for (let attempt = 1; attempt <= BOT_RETRIES; attempt++) {
    try {
      return await runBot();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed. Retrying...`);
    }
  }
  throw new Error(`Failed to start bot after ${BOT_RETRIES} attempts.`);
};

/**
 * Start the application by initializing and running bots based on game configurations.
 */
const startApplication = async () => {
  for (const { ckey, mode } of botsConfig  ) {
    console.info(`Starting bot for ckey: ${ckey}, mode: ${mode}`);
    const logging = true
    const cbot = new CBot(ckey, mode, logging);

    try {
      retry(() => cbot.run());
      console.info(`Bot (${ckey}) completed successfully.`);
    } catch (error) {
      console.error(`Bot (${ckey}) failed after ${BOT_RETRIES} attempts:`, error);
    }
  }
};

startApplication().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});

