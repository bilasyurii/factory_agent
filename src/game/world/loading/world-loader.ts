import BuildingFactory from '../building/building-factory';
import Grid from '../grid/grid';
import TileFactory from '../tiles/tile-factory';
import TileType from '../tiles/tile-type.enum';
import ILevelConfig, { ILevelBuildingConfig, ILevelSize, ILevelTileConfig, ILevelTileFillConfig, ILevelTilesConfig } from './level-config.interface';
import IWorldLoaderConfig from './world-loader-config.interface';

export default class WorldLoader {
  private grid: Grid;
  private buildingFactory: BuildingFactory;
  private tileFactory: TileFactory;

  constructor(config: IWorldLoaderConfig) {
    this.grid = config.grid;
    this.buildingFactory = config.buildingFactory;
    this.tileFactory = config.tileFactory;
  }

  public load(config: ILevelConfig): void {
    this.loadTiles(config.size, config.tiles);
    this.loadBuildings(config.buildings);
  }

  private loadTiles(size: ILevelSize, tiles: ILevelTilesConfig): void {
    this.fillTiles(size, tiles.fill);
    this.loadTileExceptions(tiles.exceptions);
  }

  private loadBuildings(buildings: ILevelBuildingConfig[]): void {
    const factory = this.buildingFactory;
    const grid = this.grid;

    buildings.forEach((config) => {
      const building = factory.create(config.type);
      const tile = grid.getTile(config.x, config.y);

      tile.setBuilding(building);
      grid.addBuilding(building);
    });
  }

  private fillTiles(size: ILevelSize, fill: ILevelTileFillConfig): void {
    const width = size.width;
    const height = size.height;
    const fillType = fill.type;

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        this.createTile(x, y, fillType);
      }
    }
  }

  private loadTileExceptions(exceptions: ILevelTileConfig[]): void {
    exceptions.forEach((config) => {
      this.createTile(config.x, config.y, config.type);
    });
  }

  private createTile(x: number, y: number, type: TileType): void {
    const tile = this.tileFactory.create(type);
    tile.setPosition(x, y);
    this.grid.addTile(tile);
  }
}
