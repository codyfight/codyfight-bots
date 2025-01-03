import MoveStrategy from './MoveStrategy.js'

class AggressiveMoveStrategy extends MoveStrategy {
  protected setTargets(): void {
    this.targets.push(this.opponent.getPosition())
  }
}

export default AggressiveMoveStrategy
