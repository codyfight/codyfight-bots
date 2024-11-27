import 'dotenv/config'

import express, { Express } from 'express'

import modules from './modules/index.js'

const app: Express = express()

await modules(app)
