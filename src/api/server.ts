import 'dotenv/config'
import path from 'path'
import routes from './routes/index.js'
import express from 'express'
import Logger from '../utils/logger.js'
import config from '../config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { basicAuthMiddleware } from './middleware/authentication.js'
import botManager from '../c-bots/c-bot-manager.js'
import { getWaitTime } from '../utils/utils.js'

const environment = config.NODE_ENV
const port = process.env.PORT || config.SERVER_PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const publicDirectory = path.resolve(
  process.cwd(),
  environment === 'development' ? 'src/client/public' : 'dist/client/public'
)

app.get('/', basicAuthMiddleware, (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'))
})

app.use(express.static(publicDirectory))
app.use(routes)
app.use(errorHandler)

async function resumeBots(): Promise<void> {
  try {
    await botManager.resumeBots()
    Logger.info('All active bots have been resumed.')
  } catch (error) {
    Logger.error('Error resuming active bots:', error)
    setTimeout(resumeBots, getWaitTime(error))
  }
}

app.listen(port, async () => {
  Logger.info(`Server starting in ${environment} mode on port ${port}`)
  Logger.info(`http://localhost:${port}`)
  try {
    await resumeBots()
    Logger.info('All active bots have been resumed.')
  } catch (error) {
    Logger.error('Error resuming active bots:', error)
  }
})
