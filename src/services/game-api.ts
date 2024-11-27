import GameAPI from 'codyfight-game-client'

const GAME_API_URL = process.env.GAME_URL as string

export default function gameAPI() {
  return new GameAPI(GAME_API_URL)
}
