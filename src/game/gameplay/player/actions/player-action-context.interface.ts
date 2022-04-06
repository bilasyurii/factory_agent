import BuildingFactory from "../../../world/building/building-factory";
import Grid from "../../../world/grid/grid";
import TileFactory from "../../../world/tiles/tile-factory";

export default interface IPlayerActionContext {
  grid: Grid;
  tileFactory: TileFactory;
  buildingFactory: BuildingFactory;
}
