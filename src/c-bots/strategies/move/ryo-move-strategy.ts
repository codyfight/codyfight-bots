import MoveStrategy from './move-strategy.js'
import { IAgentState, SpecialAgentType } from '../../../game/agents/game-agent.type.js'
import { MoveStrategyType } from './move-strategy.type.js'
import Position from '../../../game/map/position.js'


class RyoMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Ryo
  }

  protected setTargets(): void {
    const ryoAgents = this.specialAgents.get(SpecialAgentType.MrRyo);
    if (ryoAgents && ryoAgents.length > 0) {
      this._targets.push(ryoAgents[0].position);
    }
  }

  protected isGoal(state: IAgentState, target: Position): boolean {
    return state.position.adjacent(target)
  }
}

export default RyoMoveStrategy
