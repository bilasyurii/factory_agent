import BuildingFactory from '../../world/building/building-factory';
import Grid from '../../world/grid/grid';
import TileFactory from '../../world/tiles/tile-factory';
import IPlayerActionContext from './player-action-context.interface';
import PlayerActionType from './player-action-type.enum';

export default abstract class PlayerAction {
  protected type: PlayerActionType;
  protected grid: Grid;
  protected tileFactory: TileFactory;
  protected buildingFactory: BuildingFactory;

  constructor(type: PlayerActionType) {
    this.type = type;
  }

  public getType(): PlayerActionType {
    return this.type;
  }

  public setContext(context: IPlayerActionContext): void {
    this.grid = context.grid;
    this.tileFactory = context.tileFactory;
    this.buildingFactory = context.buildingFactory;
  }

  public abstract execute(): void;
}
