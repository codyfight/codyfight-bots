import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class AggressiveMoveStrategy extends MoveStrategy {
  public readonly  type = MoveStrategyType.Aggressive

  protected setTargets(): void {
    this.targets.push(this.opponent.getPosition())
  }
}

export default AggressiveMoveStrategy
