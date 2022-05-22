import BuildingFactory from '../../../world/building/building-factory';
import Grid from '../../../world/grid/grid';
import TileFactory from '../../../world/tiles/tile-factory';
import KarmaController from '../../karma/karma-controller';
import Player from '../player.abstract';

export default interface IPlayerActionContext {
  player: Player;
  grid: Grid;
  tileFactory: TileFactory;
  buildingFactory: BuildingFactory;
  karmaController: KarmaController;
}
