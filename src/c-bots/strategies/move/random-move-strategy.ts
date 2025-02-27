import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class RandomMoveStrategy extends MoveStrategy {

  public get type(): MoveStrategyType {
    return MoveStrategyType.Random
  }

  protected setTargets(): void {
    this.targets.push(this.getRandomMove())
  }
}

export default RandomMoveStrategy
