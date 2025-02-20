import MoveStrategy from './move-strategy.js'
import { SpecialAgentType } from '../../../game/agents/game-agent.type.js'


class RyoMoveStrategy extends MoveStrategy {
  protected setTargets(): void {
    const ryoAgents = this.specialAgents.get(SpecialAgentType.MrRyo);
    
    if (ryoAgents && ryoAgents.length > 0) {
      this.targets.push(ryoAgents[0].getPosition());
    }
  }

}

export default RyoMoveStrategy
