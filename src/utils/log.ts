import { IGameState } from '../types/game/index.js'
import { GameStatus } from '../types/game/state.type.js'
import { formatName } from './index.js'

function logGameInfo(gameState: IGameState, message: string) {
  const isPlaying = gameState?.state?.status === GameStatus.Playing

  const playerName = formatName(gameState?.players?.bearer?.name)

  const currentRound = gameState?.state?.round
  const totalRounds = gameState?.state?.total_rounds

  const roundInfo = isPlaying ? `Round ${currentRound}/${totalRounds} - ` : ''

  console.info(`${playerName} - ${roundInfo}${message}`)
}

function logGameError(gameState: IGameState, error: any) {
  const playerName = formatName(gameState?.players?.bearer?.name)

  const status = error?.response?.status || error?.status
  const msg = error?.response?.data?.message || error?.message || String(error)

  console.error(`${playerName} - Error: [${status}] ${msg}`)
}

function logApiError(action: string, error: any): void {
  const response = error.response || {}
  const request = error.request || ''
  const message = error.message || ''

  const logMessage = `
    Something went wrong during ${action}:
    Response: ${response.status ? `Status ${response.status}, Data: ${JSON.stringify(response.data)}` : ''}
    Request: ${request}
    Message: ${message}
  `

  console.error(logMessage.trim())
}

const log = {
  gameInfo: logGameInfo,
  gameError: logGameError,
  apiError: logApiError
}

export default log
