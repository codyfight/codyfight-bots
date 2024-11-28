import { formatName, log, sleep } from '../utils/index.js'
import { gameAPI } from '../services/index.js'
import { IGameState } from '../types/game/index.js'
import { GameMode, GameState } from '../types/game/state.type.js'

const CKEY = process.env.CKEY as string
const MODE: GameMode = GameMode.Sandbox

export default async function play() {
  if (!CKEY) {
    throw new Error('CKEY is not set, please set it in .env file')
  }

  let gameState: IGameState = await gameCheck(CKEY)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      gameState = await gameCheck(CKEY)
      gameState = await gameInit(gameState, CKEY, MODE)
      gameState = await gamePlay(gameState, CKEY)
      gameState = await gameEnded(gameState)

      if (gameState?.state?.status === GameState.Ended) {
        break
      }
    } catch (error: any) {
      log.gameError(gameState, error)
      break
    }
  }

  play()
}

async function gameCheck(ckey: string): Promise<IGameState> {
  return await gameAPI().check(ckey)
}

async function gameInit(
  _gameState: IGameState,
  ckey: string,
  mode: GameMode
): Promise<IGameState> {
  let gameState: IGameState = _gameState

  if (gameState?.state?.status === GameState.Playing) {
    return gameState
  }

  gameState = await gameAPI().init(ckey, mode)
  gameState = await gameMatchmaking(gameState, ckey)

  return gameState
}

async function gameMatchmaking(
  _gameState: IGameState,
  ckey: string
): Promise<IGameState> {
  let gameState: IGameState = _gameState

  log.gameInfo(gameState, 'Matchmaking, please wait')

  while (gameState?.state?.status === GameState.Registering) {
    await sleep(1000)
    gameState = await gameAPI().check(ckey)
  }

  return gameState
}

async function gamePlay(
  _gameState: IGameState,
  ckey: string
): Promise<IGameState> {
  let gameState: IGameState = _gameState

  if (!gameState) {
    throw new Error('Game is not in playing state')
  }

  const opponent = gameState?.players?.opponent

  if (gameState?.state?.status === GameState.Playing && opponent) {
    const initialMsg = `Playing against ${formatName(opponent.name)} (${opponent?.codyfighter?.rarity} ${opponent?.codyfighter?.class})`
    log.gameInfo(gameState, initialMsg)
  }

  while (gameState?.state?.status === GameState.Playing) {
    if (gameState?.players?.bearer?.is_player_turn) {
      gameState = await moveRandom(gameState, ckey)
    } else {
      gameState = await gameAPI().check(ckey)
    }
  }

  return gameState
}

async function gameEnded(_gameState: IGameState): Promise<IGameState> {
  if (_gameState?.state?.status === GameState.Ended) {
    const winner = _gameState?.verdict?.winner
    const isWinner = _gameState?.players?.bearer?.name === winner

    const verdict = _gameState?.verdict?.statement
    const result = isWinner ? 'Game ended - You won!' : 'Game ended - You lost!'

    const message = `${result} - ${verdict}`

    log.gameInfo(_gameState, message)
  }

  return _gameState
}

async function moveRandom(
  _gameState: IGameState,
  ckey: string
): Promise<IGameState> {
  let gameState: IGameState = _gameState

  const possibleMoves = gameState?.players?.bearer?.possible_moves
  const randomIndex = Math.floor(Math.random() * possibleMoves?.length)
  const randomMove = possibleMoves[randomIndex]

  if (!randomMove) {
    return gameState
  }

  log.gameInfo(
    gameState,
    `Moving to [x: ${randomMove?.x}, y: ${randomMove?.y}]`
  )

  gameState = await gameAPI().move(ckey, randomMove?.x, randomMove?.y)

  return gameState
}
