import 'dotenv/config'
import botManager from './c-bot-manager.js'
import Logger from '../utils/logger.js'
import { getEnvVar } from '../utils/utils.js'

Logger.setLogLevel(+getEnvVar('LOG_LEVEL'))

// Start the bot runner
Logger.info(`Application started: Running All Bots`)
await botManager.runAll()
