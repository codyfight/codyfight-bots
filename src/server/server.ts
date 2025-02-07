import 'dotenv/config'
import path from 'path'
import routes from './routes/index.js'

import express from 'express'
import Logger from '../utils/logger.js'
import { getEnvVar } from '../utils/utils.js'
import { errorHandler } from './middleware/errorHandler.js'

const environment = getEnvVar('NODE_ENV')
const port = getEnvVar('SERVER_PORT')
const logLevel = +getEnvVar('LOG_LEVEL')

Logger.setLogLevel(logLevel)
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const directory = environment === "development"
  ? "src/client/public"
  : "dist/client/public";

app.use(express.static(path.resolve(directory)));

app.use(routes)
app.use(errorHandler)

app.listen(port, () => {
  Logger.info(`Server starting in ${environment} mode on port ${port}`);
})
