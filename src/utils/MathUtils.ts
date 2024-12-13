import Position from '../game/map/Position.js'

class MathUtils {
  public static euclideanDistance(pos1: Position, pos2: Position): number {
    const dx = pos2.x - pos1.x
    const dy = pos2.y - pos1.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}

export default MathUtils
