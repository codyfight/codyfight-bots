// import 'dotenv/config'
// import CBot from './c-bot/c-bot.js'
// import Logger from '../utils/logger.js'
// import { getEnvVar, getWaitTime, wait } from '../utils/utils.js'

/**
 * Main runner function to:
 * 1. Fetch all bots
 * 2. Run each bot in an infinite loop (runBot)
 * 3. Wait for all to settle
 */
// async function runAll(): Promise<void> {
//   try {
//     // Set up logger with log level from environment variables
//     Logger.setLogLevel(+getEnvVar('LOG_LEVEL'))
//     Logger.info('Application Started, Running Bots...')
//
//     // Retrieve all bots from the configured database
//     const cbots: CBot[] = await createAllCBots()
//
//     // Create an array of promises, each running a bot in an infinite loop
//     const botPromises = cbots.map(async (cbot) => {
//       for (;;) await runBot(cbot);
//     });
//
//     // Wait for all bot promises to settle (they run indefinitely)
//     await Promise.allSettled(botPromises);
//   } catch (error) {
//     Logger.error('Error while creating or running bots:', error);
//   }
// }


/** Runs a single bot in an infinite loop with error handling & retry. */
// async function runBot(bot: CBot): Promise<void> {
//   try {
//     Logger.info(`Running Bot: ${bot.toString()}`)
//     await bot.run()
//   } catch (error) {
//     Logger.error(`Bot (${bot.toString()}) failed:`, error)
//     const waitTime = getWaitTime(error)
//     Logger.info(`Waiting for ${waitTime} ms`)
//     await wait(waitTime)
//     await runBot(bot)
//   }
// }
//
// const bot = botfactory.createBot(ckey)
// await runBot(bot)



// Start the bot runner
// await runAll()
