import GameState from '../../../game/state/game-state.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import PlayerAgent from '../../../game/agents/player-agent.js'
import { randomElement } from '../../../game/utils/game-utils.js'
import { CastStrategyType } from './cast-strategy.type.js'

abstract class CastStrategy {
  public abstract readonly type: CastStrategyType;

  protected bearer!: PlayerAgent

  public init(game: GameState): void {
    this.bearer = game.getBearer()
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
