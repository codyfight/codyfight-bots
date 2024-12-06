import GameAgent from './GameAgent.js'
import Skill from '../Skill.js'
import Position from '../Position.js'
import { IAgentData } from '../../types/game/player.type.js'

class PlayerAgent extends GameAgent {
  private possibleMoves: Position[] = []
  private skills: Skill[] = []
  private isPlayerTurn = false

  public update(agentData: IAgentData) {
    this.possibleMoves = this.mapToPositions(agentData.possible_moves)
    this.skills = this.mapToSkills(agentData.skills)
    this.isPlayerTurn = agentData.is_player_turn
    super.update(agentData)
  }

  public isTurn() {
    return this.isPlayerTurn
  }

  public getPossibleMoves(): Position[] {
    return this.possibleMoves
  }

  public getSkills(): Skill[] {
    return this.skills
  }

  private mapToPositions(data: { x: number; y: number }[]): Position[] {
    return data.map((move) => new Position(move.x, move.y))
  }

  private mapToSkills(data: any[]): Skill[] {
    return data.map((skill) => new Skill(skill))
  }
}

export default PlayerAgent
