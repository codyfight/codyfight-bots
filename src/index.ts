import dotenv from 'dotenv'
import http from 'http'

import CBot from './engine/CBot.js'
import { GameMode } from './types/game/state.type.js'
import { getEnvVar } from './utils/utils.js'

dotenv.config()

const BOT_RETRIES = parseInt(getEnvVar('BOT_RETRIES'))
const BOTS_CONFIG = JSON.parse(getEnvVar('BOTS_CONFIG'))
const LOGGING = getEnvVar('LOGGING').toLowerCase() === 'true'

type BotConfig = {
  ckey: string
  mode: GameMode
}

const routes = (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello, world!' }))

    return
  }

  if (req.url === '/health-check') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'OK' }))

    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Not found' }))
}

const server = http.createServer((req, res) => {
  routes(req, res)
})

/**
 * Retry a function with a specified number of attempts.
 *
 * @param {() => Promise<T>} runBot - The function to execute.
 * @returns {Promise<T>} The resolved value of the function.
 * @throws {Error} If all retry attempts fail.
 */
const retry = async <T>(runBot: () => Promise<T>): Promise<T> => {
  for (let attempt = 1; attempt <= BOT_RETRIES; attempt++) {
    try {
      return await runBot()
    } catch (error) {
      console.warn(`Attempt ${attempt} failed with ${error} Retrying...`)
    }
  }
  throw new Error(`Failed to start bot after ${BOT_RETRIES} attempts.`)
}

/**
 * Start the application by initializing and running bots based on game configurations.
 */
const startApplication = async () => {
  const PORT = process.env.PORT

  server.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`)

    for (const { ckey, mode } of BOTS_CONFIG) {
      console.info(`Starting bot for ckey: ${ckey}, mode: ${mode}`)
      const logging = true
      const cbot = new CBot(ckey, mode, LOGGING)

      try {
        retry(() => cbot.run())
        console.info(`Bot (${ckey}) completed successfully.`)
      } catch (error) {
        console.error(
          `Bot (${ckey}) failed after ${BOT_RETRIES} attempts:`,
          error
        )
      }
    }
  })
}

startApplication().catch((error) => {
  console.error('Error starting application:', error)
  server.close()
  process.exit(1)
})
