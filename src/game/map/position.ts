class Position {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  public add(other: Position) : Position{
    return new Position(this.x + other.x, this.y + other.y)
  }

  public equals(other: Position) : boolean{
    return this.x == other.x && this.y == other.y
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
