import MoveStrategy from './MoveStrategy.js'

class IdleMoveStrategy extends MoveStrategy {
  protected setTargets(): void {
    this.targets.push(this.bearer.getPosition())
  }
}

export default IdleMoveStrategy
