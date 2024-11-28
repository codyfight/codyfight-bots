import type { Express } from 'express'

export interface ServerConfig extends Express {
  config: {
    port: string
    env: string
    api: string
  }
}

export default async function config(app: Express): Promise<ServerConfig> {
  const {
    PORT: port = '3010',
    NODE_ENV: env = 'production',
    GAME_URL: api
  } = process.env as Record<string, string>

  const _app: ServerConfig = Object.assign(app, {
    config: {
      env,
      port,
      api
    }
  })

  console.info(`codyfight-bots: Env: ${env?.toUpperCase()}`)
  console.info(`codyfight-bots: Codyfight Game API: ${api}`)

  return _app
}
