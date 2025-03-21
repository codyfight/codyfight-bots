import CBot from './c-bot/c-bot.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'

const STOP_ERRORS = new Set([400, 422]);  // HTTP statuses
const IGNORE_CODES = new Set([0]);        // Response codes to ignore

async function handleBotError(bot: CBot, error: Error): Promise<void> {
  const { error: innerError, response } = error as any;
  const status = innerError?.status || response?.status;
  const responseCode = response?.data?.code;

  if (STOP_ERRORS.has(status)) {

    if (IGNORE_CODES.has(responseCode)) {
      Logger.warn(`Bot "${bot.ckey}" got an error with status=${status} but responseCode=${responseCode} (duplicate). Ignoring.`);
      return;
    }

    Logger.error(`Bot "${bot}" received a ${status} error. Stopping.`, error);
    await bot.stop();
    return;
  }
  
  const waitTime = getWaitTime(error);
  Logger.error(`Bot "${bot}" error calling tick(), waiting ${waitTime} ms: `, error);
  await wait(waitTime);
}

export default handleBotError;
