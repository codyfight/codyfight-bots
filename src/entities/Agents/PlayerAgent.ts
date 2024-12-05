import Agent from './Agent.js'
import Skill from '../Skill.js'
import Position from '../Position.js'
import { GameService } from '../../services/GameService.js'
import { IAgentData } from '../../types/game/player.type.js'
import GameMap from '../GameMap.js'

class PlayerAgent extends Agent {
  private possibleMoves: Position[] = []
  private skills: Skill[] = []

  constructor(
    protected gameService: GameService,
    private gameMap: GameMap,
    agentData: IAgentData
  ) {
    super(agentData)
  }

  public async castSkill(): Promise<void> {
    if (!this.canCastSkill()) return

    const skill = this.getRandomCastableSkill()
    const target = skill.getTarget()
    await this.gameService.castSkill(skill.id, target)
  }

  public async makeMove(): Promise<void> {
    const position = this.getRandomSafeMove()
    await this.gameService.move(position)
  }

  public update(agentData: IAgentData) {
    this.possibleMoves = this.mapToPositions(agentData.possible_moves)
    this.skills = this.mapToSkills(agentData.skills)
    super.update(agentData)
  }

  private getRandomCastableSkill(): Skill {
    const castableSkills = this.skills.filter((skill) => skill.isReady())
    const index = Math.floor(Math.random() * castableSkills.length)
    return castableSkills[index]
  }

  private getRandomSafeMove(): Position {
    const safeMoves = this.possibleMoves.filter((position) => {
      const tile = this.gameMap.getTile(position)
      return !tile.isDangerous()
    })

    const index = Math.floor(Math.random() * safeMoves.length)
    return safeMoves[index]
  }

  private canCastSkill(): boolean {
    return this.skills.some((skill) => skill.isReady())
  }

  private mapToPositions(data: { x: number; y: number }[]): Position[] {
    return data.map((move) => new Position(move.x, move.y))
  }

  private mapToSkills(data: any[]): Skill[] {
    return data.map((skill) => new Skill(skill))
  }
}

export default PlayerAgent
