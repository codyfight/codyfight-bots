import GameAgent from './game-agent.js'
import { IAgent, ISpecialAgent, SpecialAgentType } from './game-agent.type.js'

class SpecialAgent extends GameAgent {
  readonly type: SpecialAgentType
  
  constructor(agentData: ISpecialAgent) {
    super(agentData as IAgent)
    this.type = agentData.type
  }

  update(agentData: ISpecialAgent): void {
    super.update(agentData)
  }
}

export default SpecialAgent
