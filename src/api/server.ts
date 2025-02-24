import 'dotenv/config'
import path from 'path'
import routes from './routes/index.js'

import express from 'express'
import Logger from '../utils/logger.js'
import config from '../config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { basicAuthMiddleware } from './middleware/authentication.js'
import botManager from '../c-bots/c-bot-manager.js'


const environment = config.NODE_ENV
const port = process.env.PORT || config.SERVER_PORT || 3000;

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const publicDirectory = path.resolve(
  process.cwd(),
  environment === "development" ? "src/client/public" : "dist/client/public"
);

app.get('/', basicAuthMiddleware, (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.use(express.static(publicDirectory));

app.use(routes)
app.use(errorHandler)

app.listen(port, async () => {
  Logger.info(`Server starting in ${environment} mode on port ${port}`);
  Logger.info(`http://localhost:${port}`);
  try {
    await botManager.restartBots()
    Logger.info('All active bots have been started.');
  } catch (error) {
    Logger.error('Error starting bots:', error);
  }
});
