declare module 'codyfight-game-client' {
  import type { IGameState } from '../game/index.ts'
  import type { GameMode } from '../game/state.type.ts'

  export class GameAPI {
    constructor(gameUrl: string)
    check(ckey: string): Promise<IGameState>
    surrender(ckey: string): Promise<IGameState>
    move(ckey: string, x: number, y: number): Promise<IGameState>
    init(ckey: string, mode: GameMode, opponent?: string): Promise<IGameState>
    cast(
      ckey: string,
      skill_id: number,
      x: number,
      y: number
    ): Promise<IGameState>
  }

  export default GameAPI
}
