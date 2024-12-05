import Position from '../Position.js'
import Updatable from '../../interfaces/Updatable.js'
import { IAgentData } from '../../types/game/player.type.js'

class Agent implements Updatable {
  readonly name: string
  private position: Position = new Position(0, 0)

  constructor(agentData: IAgentData) {
    this.name = agentData.name
    this.update(agentData)
  }

  public update(agentData: IAgentData): void {
    this.position = new Position(agentData.position.x, agentData.position.y)
  }
}

export default Agent
