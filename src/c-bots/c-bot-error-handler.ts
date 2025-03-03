import CBot from './c-bot/c-bot.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'

const STOP_ERRORS = new Set([400, 422]);

async function handleBotError(bot: CBot, error: Error): Promise<void> {
  const { error: innerError, response } = error as any;
  const status = innerError?.status || response?.status;

  if (STOP_ERRORS.has(status)) {
    Logger.error(`Bot "${bot}" received a ${status} error. Stopping the bot.`, error);
    bot.stopPlaying();
    return;
  }

  const waitTime = getWaitTime(error);
  Logger.error(`Bot "${bot}" error calling tick(), waiting ${waitTime} ms: `, error);
  await wait(waitTime);
}

export default handleBotError;
