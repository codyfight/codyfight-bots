import Position from '../Position.js'
import Skill from '../Skill.js'
import Updatable from '../../interfaces/Updatable.js'
import { IAgentData } from '../../types/game/player.type.js'

class Agent implements Updatable {
  readonly name: string
  protected isPlayerTurn = false
  private hitpoints = 0
  private energy = 0
  private position: Position = new Position(0, 0)
  protected possibleMoves: Position[] = []
  protected skills: Skill[] = []

  constructor(agentData: IAgentData) {
    this.name = agentData.name
    this.update(agentData)
  }

  //TODO - Only the playing agent needs to know about possible moves etc..
  update(agentData: IAgentData): void {
    this.isPlayerTurn = agentData.is_player_turn
    this.hitpoints = agentData.stats.hitpoints
    this.energy = agentData.stats.energy
    this.position = new Position(agentData.position.x, agentData.position.y)
    this.possibleMoves = this.mapToPositions(agentData.possible_moves)
    this.skills = this.mapToSkills(agentData.skills)
  }

  private mapToPositions(data: { x: number; y: number }[]): Position[] {
    return data.map((move) => new Position(move.x, move.y))
  }

  private mapToSkills(data: any[]): Skill[] {
    return data.map((skill) => new Skill(skill))
  }
}

export default Agent
