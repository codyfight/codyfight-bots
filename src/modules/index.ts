import config from './config.js'
import router from './router.js'
import server from './server.js'

import type { Express } from 'express'

export default async function modules(_app: Express) {
  const app = await config(_app)

  await router(app)
  server(app)
}
