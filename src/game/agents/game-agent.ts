import IUpdatable from '../interfaces/updatable.interface.js'
import Position from '../map/position.js'
import { IAgent } from './game-agent.type.js'

class GameAgent implements IUpdatable {
  readonly id: number
  readonly name: string
  private position: Position = new Position(0, 0)

  constructor(agentData: IAgent) {
    this.id = agentData.id
    this.name = agentData.name
    this.update(agentData)
  }

  public update(agentData: IAgent): void {
    this.setPosition(agentData)
  }

  public getPosition(): Position {
    return this.position
  }

  private setPosition(agentData: IAgent): void {
    if (agentData.position) {
      this.position = new Position(agentData.position.x, agentData.position.y)
    }
  }
}

export default GameAgent
