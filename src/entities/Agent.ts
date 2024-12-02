import Position from './Position.ts'
import Skill from './Skill.ts'

class Agent {
  name: string;
  hitpoints: number;
  energy: number;
  position: Position;
  possibleMoves: Position[];
  isPlayerTurn: boolean;
  skills: Skill[];

  constructor(agentData: any) {
    this.name = agentData.name;
    this.hitpoints = agentData.stats.hitpoints;
    this.energy = agentData.stats.energy;
    this.position = new Position(agentData.position.x, agentData.position.y);
    this.isPlayerTurn = agentData.is_player_turn;
    this.possibleMoves = agentData.possible_moves.map(
      (moveData: any) => new Position(moveData.x, moveData.y)
    );
    this.skills = agentData.skills.map((skillData: any) => new Skill(skillData));
  }

}

export default Agent;
