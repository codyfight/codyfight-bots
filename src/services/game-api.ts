import GameAPI from 'codyfight-game-client'

import type { IGameAPI } from '../types/api/game-api.type.js'

const GAME_API_URL = process.env.GAME_URL as string

export default function gameAPI() {
  if (!GAME_API_URL) {
    throw new Error('GAME_URL is not set, please set it in .env file')
  }

  return new GameAPI(GAME_API_URL) as IGameAPI
}
