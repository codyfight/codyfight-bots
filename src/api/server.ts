import 'dotenv/config'
import path from 'path'
import routes from './routes/index.js'

import express from 'express'
import Logger from '../utils/logger.js'
import config from '../config/env.js'
import { errorHandler } from './middleware/errorHandler.js'

const environment = config.NODE_ENV
const port = process.env.PORT || config.SERVER_PORT || 3000;

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
  Logger.info(`http://localhost:${port}`);
})
