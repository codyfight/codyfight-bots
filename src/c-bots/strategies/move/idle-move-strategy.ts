import MoveStrategy from './move-strategy.js'

class IdleMoveStrategy extends MoveStrategy {
  protected setTargets(): void {
    this.targets.push(this.bearer.getPosition())
  }
}

export default IdleMoveStrategy
