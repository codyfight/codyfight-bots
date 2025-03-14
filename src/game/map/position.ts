import { euclideanDistance } from '../utils/game-utils.js'

class Position {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  public add(other: Position) : Position{
    return new Position(this.x + other.x, this.y + other.y)
  }

  public subtract(other: Position): Position {
    return new Position(this.x - other.x, this.y - other.y)
  }

  public equals(other: Position) : boolean{
    return this.x == other.x && this.y == other.y
  }

  public adjacent(other: Position) : boolean{
    return euclideanDistance(this, other) == 1
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`
  }

  public static getDirections(): Position[] {
    return [
      new Position(0, 1),  // Up
      new Position(1, 0),  // Right
      new Position(0, -1), // Down
      new Position(-1, 0)  // Left
    ];
  }
}

export default Position
