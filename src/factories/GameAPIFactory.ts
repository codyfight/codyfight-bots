import GameAPI from 'codyfight-game-client'
import { GAME_API_URL } from '../constants/constants.js'
import { IGameAPI } from '../types/api/game-api.type.js'

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
