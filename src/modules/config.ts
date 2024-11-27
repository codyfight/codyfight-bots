import type { Express } from 'express'

export interface ServerConfig extends Express {
  config: {
    env: string
    port: string
    api: string
  }
}

export default async function config(app: Express): Promise<ServerConfig> {
  const {
    CODYFIGHT_GAME_URL: api,
    PORT: port,
    NODE_ENV: env
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
