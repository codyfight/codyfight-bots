import cors from 'cors'
import express from 'express'

import { general } from '../routes/index.js'

import type { ServerConfig } from './config.js'

export default async function router(app: ServerConfig) {
  app.use(express.json())
  app.use(cors())

  general(app)
}
