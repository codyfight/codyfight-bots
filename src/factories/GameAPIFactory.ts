import GameAPI from 'codyfight-game-client'
import { IGameAPI } from '../types/api/game-api.type.js'
import { getEnvVar } from '../utils/utils.js'

const GAME_API_URL = getEnvVar('GAME_API_URL');

class GameAPIFactory {
  private static gameAPI?: IGameAPI

  public static get(): IGameAPI {
    if (!this.gameAPI) {
      this.gameAPI = new GameAPI(GAME_API_URL) as IGameAPI
    }

    return this.gameAPI
  }
}

export default GameAPIFactory
