import MoveStrategy from './move-strategy.js'
import { MoveStrategyType } from './move-strategy.type.js'

class RandomMoveStrategy extends MoveStrategy {

  public get description(): string {
    return 'Your bot will move randomly.'
  }

  public get type(): MoveStrategyType {
    return MoveStrategyType.Random
  }

  protected setTargets(): void {
    this._targets.push(this.getRandomMove())
  }
}

export default RandomMoveStrategy
