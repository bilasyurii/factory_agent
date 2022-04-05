import Grid from '../grid/grid';
import BuildingFactory from '../building/building-factory';
import TileFactory from '../tiles/tile-factory';

export default interface IWorldLoaderConfig {
  grid: Grid;
  buildingFactory: BuildingFactory;
  tileFactory: TileFactory;
}
