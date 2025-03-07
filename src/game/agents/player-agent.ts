import GameAgent from './game-agent.js'
import Position from '../map/position.js'
import Skill from '../skills/skill.js'
import { IPlayerAgent, ISkillState } from './game-agent.type.js'
import { SkillCategory } from '../skills/skill-type.js'

class PlayerAgent extends GameAgent {
  private possibleMoves: Position[] = []
  private skills: Skill[] = []
  private _isPlayerTurn = false

  public update(agentData: IPlayerAgent) {
    this.possibleMoves = this.mapToPositions(agentData.possible_moves)
    this.skills = this.mapToSkills(agentData.skills)
    this._isPlayerTurn = agentData.is_player_turn
    super.update(agentData)
  }

  public get isPlayerTurn() {
    return this._isPlayerTurn
  }

  public getPossibleMoves(): Position[] {
    return this.possibleMoves
  }

  public get availableSkills(): Skill[] {
    return this.skills.filter((skill) => skill.ready)
  }

  public createSkillsState(): ISkillState[] {
    return this.availableSkills
      .filter(skill => skill.category === SkillCategory.MovementPlayer)
      .map(skill => ({
        id: skill.id,
        category: skill.category,
        ready: skill.ready,
        targets: skill.possibleTargets
      }));
  }

  private mapToPositions(data: { x: number; y: number }[]): Position[] {
    return data.map((move) => new Position(move.x, move.y))
  }

  private mapToSkills(data: any[]): Skill[] {
    return data.map((skill) => new Skill(skill))
  }
}

export default PlayerAgent
