import express from 'express'

import type { ServerConfig } from '../modules/config.js'

const NAMESPACE = '/'

export default async function general(app: ServerConfig) {
  const router = express.Router()

  router.get('/', (req, res) => res.status(200).json({ message: 'OK' }))

  app.use(NAMESPACE, router)
}
