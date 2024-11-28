declare module 'codyfight-game-client' {
  import { IGameAPI } from './game-api.type.ts'

  class GameAPI implements IGameAPI {
    constructor(gameUrl: string)
  }

  export default GameAPI
}
