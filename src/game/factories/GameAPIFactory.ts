import GameAPI from 'codyfight-game-client'
import { IGameAPI } from '../../types/api/game-api.type.js'

class GameAPIFactory {
  static create(gameApiUrl: string): IGameAPI {
    return new GameAPI(gameApiUrl) as IGameAPI
  }
}

export default GameAPIFactory
