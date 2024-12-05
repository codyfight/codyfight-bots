import { IGameState } from '../types/game/index.js'
import { formatName } from './index.js'

function logGameInfo(gameState: IGameState) {
  const currentRound = gameState?.state?.round
  const totalRounds = gameState?.state?.total_rounds
  const possibleMoves = gameState?.players?.bearer?.possible_moves || []

  console.info('--- Game Info ---')
  console.info(`Round: ${currentRound}`)
  console.info(`Total Rounds: ${totalRounds}`)
  console.info(
    `Possible Moves: ${possibleMoves
      .map((move) => `[x: ${move.x}, y: ${move.y}]`)
      .join(', ')}`
  )
  console.info('------------------')
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
