import Building from '../building/building';
import Tile from '../tiles/tile';
import IGridConfig from './grid-config.interface';
import GridEventType from './grid-event-type.enum';

export default class Grid extends Phaser.Events.EventEmitter {
  public readonly scene: Scene;
  private tiles: Tile[][];
  private buildings: Building[] = [];
  private width: number = 0;
  private height: number = 0;

  constructor(scene: Scene, config: IGridConfig) {
    super();

    this.scene = scene;
    this.width = config.width;
    this.height = config.height;
    this.initArray();
  }

  public getTile(x: number, y: number): Tile {
    return this.tiles[y][x];
  }

  public addTile(tile: Tile): void {
    this.tiles[tile.getY()][tile.getX()] = tile;
    this.emit(GridEventType.TileAdded, tile);
  }

  public addBuilding(building: Building): void {
    this.buildings.push(building);
    this.emit(GridEventType.BuildingAdded, building);
  }

  private initArray(): void {
    const width = this.width;
    const height = this.height;
    const tiles: Tile[][] = [];
    this.tiles = tiles;

    for (let i = 0; i < height; ++i) {
      const row: Tile[] = [];
      tiles.push(row);

      for (let j = 0; j < width; ++j) {
        row.push(null);
      }
    }
  }
}
