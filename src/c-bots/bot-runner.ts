import 'dotenv/config'
import CBot from './c-bot/c-bot.js'
import Logger from '../utils/logger.js'
import { createAllCBots } from './c-bot/create-all-c-bots.js'

const logger = new Logger(true)

try {
  logger.logInfo('Application Started, Running Bots...')
  const cbots: CBot[] = await createAllCBots()

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
