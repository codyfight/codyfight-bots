import 'dotenv/config'
import CBot from './cbot/c-bot.js'
import Logger from '../utils/logger.js'
import { createAllBots } from './cbot/create-all-bots.js'

const logger = new Logger(true)

try {
  logger.logInfo('Application Started, Running Bots...')
  const cbots: CBot[] = await createAllBots()

  cbots.forEach((cbot: CBot) => {
    try {
      logger.logInfo(`Running Bot: ${cbot.toString()}`)
      cbot.run()
    } catch (error) {
      logger.logError(`Bot (${cbot.toString()}) failed with error: ${error}`)
    }
  })
} catch (error) {
  console.error('Error while creating bots:', error)
}
