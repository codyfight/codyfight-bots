import Skill from '../entities/Skill.js'
import GameState from '../entities/GameState.js'
import Position from '../entities/Position.js'

class StrategyManager {

  public determineMove(game: GameState): Position {

    // TODO :: use game.getStrategy()

    const possibleMoves = game.getBearer().getPossibleMoves()

    const safeMoves = possibleMoves.filter((position) => {
      const tile = game.getMap().getTile(position)
      return !tile.isDangerous()
    })

    const index = Math.floor(Math.random() * safeMoves.length)
    return safeMoves[index]
  }

  public determineCast(game: GameState): Skill | null {
    // TODO :: use game.getStrategy()

    const skills = game.getBearer().getSkills()
    const castableSkills = skills.filter((skill) => skill.isReady())
    const index = Math.floor(Math.random() * castableSkills.length)
    return castableSkills[index]
  }
}
 export default StrategyManager
