import MoveStrategy from './MoveStrategy.js'

class RandomMoveStrategy extends MoveStrategy {

  protected setTargets(): void {
    this.targets.push(this.getRandomMove())
  }
}

export default RandomMoveStrategy
