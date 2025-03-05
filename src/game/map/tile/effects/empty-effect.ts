import TileEffect from './tile-effect.js'
import { IAgentState } from '../../../agents/game-agent.type.js'

class EmptyEffect extends TileEffect {
  public apply(agentState: IAgentState): IAgentState {
    return agentState
  }
}

export default EmptyEffect
