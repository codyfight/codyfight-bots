import { SpecialAgentType } from '../../../game/agents/game-agent.type.js'
import GameAgent from '../../../game/agents/GameAgent.js'
import GameMap from '../../../game/map/GameMap.js'
import Position from '../../../game/map/Position.js'
import Tile from '../../../game/map/tile/Tile.js'
import { TileType } from '../../../game/map/tile/tile.type.js'
import Skill from '../../../game/skills/Skill.js'
import GameState from '../../../game/state/GameState.js'
import MathUtils from '../../../utils/MathUtils.js'
import { randomElement } from '../../../utils/utils.js'
import CastStrategy from './CastStrategy.js'

const SKILL_LIST_MOBILITY = [7, 19, 48]

const ALLIED_AGENTS = [
  SpecialAgentType.Buzz,
  SpecialAgentType.Mole,
  SpecialAgentType.Llama
]

class ScoutCastStrategy extends CastStrategy {
  public determineCast(game: GameState): [Skill, Position] | null {
    return this.getScoutCast(game)
  }

  private getScoutCast(game: GameState): [Skill, Position] | null {
    const bearer = game.getBearer()
    const skills = bearer.getSkills()
    const castableSkills = skills.filter((skill) => skill.isReady())

    if (!castableSkills?.length) return null

    const mobilitySkill = castableSkills.find((skill) =>
      SKILL_LIST_MOBILITY.includes(skill.id)
    )

    if (mobilitySkill) {
      return this.castMobilitySkill(game, mobilitySkill)
    }

    const randomSkill = randomElement(castableSkills)

    if (!randomSkill) return null

    const isAttackSkill = randomSkill?.data?.damage > 0

    if (isAttackSkill) {
      const targets = this.getEnemyAgents(game, randomSkill.possibleTargets)

      if (targets?.length) {
        return [randomSkill, targets?.[0]]
      }
    }

    const randomTarget = randomElement(randomSkill.possibleTargets)

    if (!randomTarget) return null

    return [randomSkill, randomTarget]
  }

  private castMobilitySkill(
    game: GameState,
    skill: Skill
  ): [Skill, Position] | null {
    // Blink to a location within the given range.
    /*     'cost' => 400,
      'targeting_type' => SkillTargetingType::DIAMOND,
      'range' => 2,
      'damage' => 0,
      'cooldown' => 9,
      'description' => 'Blink to a location within the given range.', */
    /**
     *      x
     *    x x x
     *  x x o x x
     *    x x x
     *      x
     */
    // cast this skill towards the exit

    if (!skill?.isReady()) return null

    const map = game.getMap()
    const bearer = game.getBearer()
    const agents = game.getAgents()
    const position = bearer.getPosition()

    const possibleTargets = skill?.possibleTargets

    const safeTargets = possibleTargets.filter((target) => {
      const tile = map.getTile(target)
      return tile?.type !== TileType.DeathPit
    })

    if (!safeTargets) return null

    // for each possible target, check which one is the closest to the exit
    const closestExit = this.getClosestExit(map, position)
    const ryoPosition = this.getRyoPosition(agents)

    const strategyTarget = closestExit ?? ryoPosition

    if (!strategyTarget) return null

    const bestTarget = this.getClosestTarget(strategyTarget, safeTargets)

    if (!bestTarget) return null

    // check if best target makes the player far from the exit
    const distanceToTarget = MathUtils.euclideanDistance(
      bestTarget,
      strategyTarget
    )
    const distanceToBearer = MathUtils.euclideanDistance(bestTarget, position)

    if (distanceToTarget < distanceToBearer) return null

    return [skill, bestTarget]
  }

  private getEnemyAgents(
    game: GameState,
    possibleTargets: Position[]
  ): Position[] {
    return possibleTargets.filter((target) => {
      const isTargetEnemy = game.getAgents().find((agent: GameAgent) => {
        const isAgentAllied = ALLIED_AGENTS.includes(agent.id)
        const isTargetAgent = agent.getPosition().equals(target)

        if (isAgentAllied || !isTargetAgent) return false

        return true
      })

      return isTargetEnemy
    })
  }

  private getRyoPosition(agents: GameAgent[]): Position | null {
    const ryo = agents.find((agent) => agent.id === SpecialAgentType.MrRyo)

    if (!ryo) return null

    return ryo.getPosition()
  }

  private getClosestExit(map: GameMap, origin: Position): Position | null {
    const exits: Tile[] = map.getTiles(TileType.ExitGate)

    if (exits.length === 0) return null

    const exitPositions = exits.map((tile) => tile.position)
    const closestExit = this.findClosestPosition(origin, exitPositions)

    return closestExit
  }

  private getClosestTarget(
    origin: Position,
    targets: Position[]
  ): Position | null {
    return this.findClosestPosition(origin, targets)
  }

  private findClosestPosition(origin: Position, targets: Position[]): Position {
    return targets.reduce((closest, target) => {
      const currentDistance = MathUtils.euclideanDistance(origin, target)
      const closestDistance = MathUtils.euclideanDistance(origin, closest)
      return currentDistance < closestDistance ? target : closest
    })
  }
}

export default ScoutCastStrategy
