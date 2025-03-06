import GameAPI from 'codyfight-game-client'
import { IGameAPI } from './game-api.interface.js'
import config from '../../config/env.js'

/**
 * Factory function to create a GameAPI instance.
 * @param gameApiUrl - The URL of the GameAPI.
 * @returns An instance of the GameAPI as IGameAPI.
 */
export function createGameAPI(): IGameAPI {
  return new GameAPI(config.GAME_API_URL) as IGameAPI;
}
