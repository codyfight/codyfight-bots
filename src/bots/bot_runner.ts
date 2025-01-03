import 'dotenv/config'
import CBot from './cbot/CBot.js'
import { CBotFactory } from './cbot/CBotFactory.js'
import Logger from '../utils/Logger.js'

const logger = new Logger(true)

try {
  logger.logInfo('Application Started, Running Bots...')
  const cbots: CBot[] = await CBotFactory.createAllBots()

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
