import type { GameMode } from '../game/state.type.js'
import { IGameState } from '../game/index.js'

export interface IGameAPI {
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
