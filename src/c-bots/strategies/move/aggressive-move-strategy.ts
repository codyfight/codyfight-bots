import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class AggressiveMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Aggressive
  }

  protected setTargets(): void {
    this.targets.push(this.opponent.position)
  }
}

export default AggressiveMoveStrategy
