import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class IdleMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Idle
  }

  protected setTargets(): void {
    this._targets.push(this.bearer.position)
  }
}

export default IdleMoveStrategy
