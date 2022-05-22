import BuildingFactory from '../../../world/building/building-factory';
import Grid from '../../../world/grid/grid';
import TileFactory from '../../../world/tiles/tile-factory';
import KarmaController from '../../karma/karma-controller';
import Player from '../player.abstract';
import IPlayerActionContext from './player-action-context.interface';
import PlayerActionType from './player-action-type.enum';

export default abstract class PlayerAction {
  protected type: PlayerActionType;
  protected player: Player;
  protected grid: Grid;
  protected tileFactory: TileFactory;
  protected buildingFactory: BuildingFactory;
  protected karmaController: KarmaController;

  constructor(type: PlayerActionType) {
    this.type = type;
  }

  public getType(): PlayerActionType {
    return this.type;
  }

  public setContext(context: IPlayerActionContext): void {
    this.player = context.player;
    this.grid = context.grid;
    this.tileFactory = context.tileFactory;
    this.buildingFactory = context.buildingFactory;
    this.karmaController = context.karmaController;
  }

  public abstract execute(): void;
}
