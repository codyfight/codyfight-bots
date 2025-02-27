import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class IdleMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Idle
  }

  protected setTargets(): void {
    this.targets.push(this.bearer.getPosition())
  }
}

export default IdleMoveStrategy
