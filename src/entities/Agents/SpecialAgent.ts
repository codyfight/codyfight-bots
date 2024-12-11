import GameAgent from './GameAgent.js'
import { IAgent, ISpecialAgent } from '../../types/game/agent.type.js'

class SpecialAgent extends GameAgent {
  constructor(agentData: ISpecialAgent) {
    super(agentData as IAgent);
  }

  update(agentData: ISpecialAgent): void {
    super.update(agentData);
  }
}

export default SpecialAgent
