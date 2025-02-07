import botManager from './c-bot-manager.js'
import Logger from '../utils/logger.js'

// Start the bot runner
Logger.info(`Application started: Running All Bots`)
await botManager.runAll()
