import ExitMoveStrategy from './exit-move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class DynamicMoveStrategy extends ExitMoveStrategy {

  public get description(): string {
    return 'Your bot will dynamically select the best target to move towards.'
  }

  public get type(): MoveStrategyType {
    return MoveStrategyType.Dynamic
  }

  protected setTargets(): void {
    super.setTargets()
    this._targets.push(this.opponent.position)
  }
}

export default DynamicMoveStrategy
