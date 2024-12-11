
import type { IState } from './state.type.js'
import type { IVerdict } from './verdict.type.js'

import { IPlayerAgent, ISpecialAgent } from './agent.type.js'
import { ITile } from './tile.type.js'

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
