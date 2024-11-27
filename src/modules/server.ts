import type { ServerConfig } from './config.js'

export default function server(app: ServerConfig) {
  const server = app.listen(app?.config?.port, () => {
    process.send?.('ready')
    console.info(
      `codyfight-bots: ${app?.config?.env} server: http://localhost:${app?.config?.port}`
    )
  })

  process.on('SIGINT', () => {
    server.close((err: any) => {
      console.warn('codyfight-bots: Closed connection')
      process.exit(err ? 1 : 0)
    })
  })
}
