import GameState from '../../../game/state/game-state.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import PlayerAgent from '../../../game/agents/player-agent.js'
import { randomElement } from '../../../game/utils/game-utils.js'
import { CastStrategyType } from './cast-strategy.type.js'
import GameAgent from '../../../game/agents/game-agent.js'

// A good way to improve how these strategies work is to introduce the concept of a result
// This means, that we can guess the result of a cast, and then decide if we want to cast or not
// For example, if we want to catch ryo, if the result moves us closer to that goal, then we should cast it
// If it moves us further, then we should not cast it
// The result could be things like, reduces available moves for ryo, or moves us closer to ryo, or stuns him etc..

// Each skill result could have a utility, and we can use that to decide which one is the best to cast
// Then we could even take into account potential future moves, and decide if we want to wait and cast next turn

abstract class CastStrategy {
  public abstract readonly type: CastStrategyType;

  protected bearer!: PlayerAgent
  protected opponent!: GameAgent

  public init(game: GameState): void {
    this.bearer = game.getBearer()
    this.opponent = game.getOpponent()
  }

  protected abstract determineSkill(): Skill | null
  protected abstract determineTarget(skill: Skill): Position | null

  public determineCast(): [Skill, Position] | null{
    if (!this.bearer.isPlayerTurn) return null

    const skill = this.determineSkill()
    if (!skill) return null

    const target = this.determineTarget(skill)
    if (!target) return null

    return [skill, target]
  }

  protected getRandomSkill(): Skill | null {
    const skills = this.bearer.availableSkills
    return skills.length > 0 ? randomElement(skills) : null
  }

  protected getRandomTarget(skill: Skill): Position | null {
    const targets = skill.possibleTargets
    return targets.length > 0 ? randomElement(targets) : null
  }

}

export default CastStrategy
