import PlayerAction from './player-action.abstract';
import PlayerActionType from './player-action-type.enum';

export default class DestroyAction extends PlayerAction {
  protected x: number;
  protected y: number;

  constructor(x: number, y: number) {
    super(PlayerActionType.Destroy);

    this.x = x;
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public execute(): void {
    this.grid.removeBuildingAt(this.x, this.y);
  }

  public toString(): string {
    return `Destroy at x=${this.x} y=${this.y}`;
  }
}
