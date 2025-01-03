import GameAPI from 'codyfight-game-client'
import { IGameAPI } from './game-api.interface.js'

/**
 * Factory function to create a GameAPI instance.
 * @param gameApiUrl - The URL of the GameAPI.
 * @returns An instance of the GameAPI as IGameAPI.
 */
export function createGameAPI(gameApiUrl: string): IGameAPI {
  return new GameAPI(gameApiUrl) as IGameAPI;
}
