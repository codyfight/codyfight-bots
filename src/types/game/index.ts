
import { GameMode, IState } from './state.type.js'
import type { IVerdict } from './verdict.type.js'

import { IPlayerAgent, ISpecialAgent } from './agent.type.js'
import { ITile } from './tile.type.js'
import { MoveStrategyType } from '../../bots/strategies/MoveStrategy.js'

export interface IGameState {
  map: ITile [][]
  state: IState
  verdict: IVerdict
  players: {
    bearer: IPlayerAgent
    opponent: IPlayerAgent
  }
  special_agents: ISpecialAgent[] | []
}

export interface CBotConfig {
  ckey: string
  mode: GameMode
  url: string
  logging: boolean
  move_strategy: MoveStrategyType
}
