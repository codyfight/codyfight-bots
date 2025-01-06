import MoveStrategy from './move-strategy.js'

class AggressiveMoveStrategy extends MoveStrategy {
  protected setTargets(): void {
    this.targets.push(this.opponent.getPosition())
  }
}

export default AggressiveMoveStrategy
