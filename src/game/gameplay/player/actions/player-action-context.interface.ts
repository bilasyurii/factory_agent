import BuildingFactory from '../../../world/building/building-factory';
import Grid from '../../../world/grid/grid';
import TileFactory from '../../../world/tiles/tile-factory';
import Player from '../player.abstract';

export default interface IPlayerActionContext {
  player: Player;
  grid: Grid;
  tileFactory: TileFactory;
  buildingFactory: BuildingFactory;
}
