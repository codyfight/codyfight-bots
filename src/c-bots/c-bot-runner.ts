import 'dotenv/config'
import CBot from './c-bot/c-bot.js'
import Logger from '../utils/logger.js'
import { createAllCBots } from './c-bot/create-all-c-bots.js'

/**
 * Main entry point for running the bots.
 * - Retrieves all bot configurations from the repository using `createAllCBots`.
 * - Creates an instance of each bot and runs it.
 * - Bots are intentionally run asynchronously (not awaited) to execute concurrently.
 */

try {
  const logger = new Logger(true)
  logger.logInfo('Application Started, Running Bots...')

  // Retrieve and initialize all bots from the repository
  const cbots: CBot[] = await createAllCBots()

  cbots.forEach((cbot: CBot) => {
    try {
      logger.logInfo(`Running Bot: ${cbot.toString()}`)
      cbot.run()  // Run each bot asynchronously
    } catch (error) {
      logger.logError(`Bot (${cbot.toString()}) failed with error: ${error}`)
    }
  })
} catch (error) {
  // Log error if bot fails
  console.error('Error while creating bots:', error)
}
