import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'
import { IAgentState } from '../../../game/agents/game-agent.type.js'
import Position from '../../../game/map/position.js'

class AggressiveMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Aggressive
  }

  protected setTargets(): void {
    this._targets.push(this.opponent.position)
  }

  protected isGoal(state: IAgentState, target: Position): boolean {
    return state.position.adjacent(target)
  }
}

export default AggressiveMoveStrategy
