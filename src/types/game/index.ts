import type { Map } from './map.type.js'
import type { IState } from './state.type.js'
import { IAgentData } from './player.type.js'
import type { IVerdict } from './verdict.type.js'
import type { ISpecialAgent } from './special-agent.type.js'

export interface IGameState {
  map: Map | []
  state: IState
  verdict: IVerdict
  players: {
    bearer: IAgentData
    opponent: IAgentData
  }
  special_agents: ISpecialAgent[] | []
}
