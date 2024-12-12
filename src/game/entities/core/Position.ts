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
}

export default Position
