import ExitMoveStrategy from './exit-move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class DynamicMoveStrategy extends ExitMoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Dynamic
  }

  protected setTargets(): void {
    super.setTargets()
    this.targets.push(this.opponent.getPosition())
  }
}

export default DynamicMoveStrategy
