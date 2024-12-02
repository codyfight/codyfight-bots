class Position {
  constructor(public x: number, public y: number) {}

  equals(position: Position): boolean {
    return this.x === position.x && this.y === position.y;
  }
}

export default Position;
