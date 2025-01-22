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

  // Time-based error handling
  // if max errors occurs within time window, execution of bot is stopped
  const MAX_ERRORS = 100
  const ERROR_TIME_WINDOW = 5 * 60 * 1000
  const botErrorLogs = new Map<string, number[]>()

  const botPromises = cbots.map(async (cbot) => {
    const botKey = cbot.toString()
    botErrorLogs.set(botKey, [])

    for (;;) {
      try {
        logger.logInfo(`Running Bot: ${cbot.toString()}`)
        await cbot.run()
      } catch (error) {
        console.error(`Bot (${cbot.toString()}) failed with error: ${error}`)

        const currentTime = Date.now()
        const errorTimestamps = botErrorLogs.get(botKey) || []
        errorTimestamps.push(currentTime)

        // Filter out errors older than the time window
        const recentErrors = errorTimestamps.filter(
          (timestamp) => currentTime - timestamp <= ERROR_TIME_WINDOW
        )

        botErrorLogs.set(botKey, recentErrors)

        if (recentErrors.length >= MAX_ERRORS) {
          logger.logError(
            `Bot (${cbot.toString()}) exceeded maximum error threshold (${MAX_ERRORS}) in ${ERROR_TIME_WINDOW / 1000} seconds. Stopping bot.`
          )

          return
        }

        await new Promise((resolve) => setTimeout(resolve, 5000)) // 5 second delay
      }
    }
  })

  await Promise.allSettled(botPromises)
} catch (error) {
  console.error('Error while creating bots:', error)
}
