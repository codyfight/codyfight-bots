import ExitMoveStrategy from './exit-move-strategy.js'

class DynamicMoveStrategy extends ExitMoveStrategy {
  protected setTargets(): void {
    super.setTargets()
    this.targets.push(this.opponent.getPosition())
  }
}

export default DynamicMoveStrategy
