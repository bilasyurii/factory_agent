import ArrayUtils from '../../../utils/array-utils';
import Building from '../building/building';
import Tile from '../tiles/tile';
import TileEventType from '../tiles/tile-event-type.enum';
import TileView from '../tiles/tile-view';
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

  public getBuilding(x: number, y: number): Building {
    const tile = this.tiles[y][x];
    return tile ? tile.getBuilding() : null;
  }

  public addTile(tile: Tile): void {
    const tiles = this.tiles;
    const x = tile.getX();
    const y = tile.getY();
    const prevTile = tiles[y][x];

    if (prevTile === tile) {
      return;
    }

    if (prevTile) {
      this.removeTileAt(x, y);
    }

    tiles[y][x] = tile;

    this.listenTile(tile);

    const view = tile.getView();

    if (view) {
      this.emit(GridEventType.AddTileView, view);
    }
  }

  public removeTileAt(x: number, y: number): void {
    const tiles = this.tiles;
    const tile = tiles[y][x];

    if (!tile) {
      return;
    }

    tiles[y][x] = null;

    this.stopListeningTile(tile);

    const view = tile.getView();

    if (view) {
      this.emit(GridEventType.RemoveTileView, view);
    }
  }

  public addBuilding(building: Building): void {
    const buildings = this.buildings;

    if (buildings.indexOf(building) !== -1) {
      return;
    }

    const x = building.getX();
    const y = building.getY();
    const prevBuilding = this.getBuilding(x, y);

    if (prevBuilding && prevBuilding !== building) {
      this.removeBuildingAt(x, y);
    }

    buildings.push(building);

    const tile = this.tiles[y][x];

    if (tile) {
      tile.setBuilding(building);
    }

    const view = building.getView();

    if (view) {
      this.emit(GridEventType.AddBuildingView, view);
    }
  }

  public removeBuildingAt(x: number, y: number): void {
    const building = this.getBuilding(x, y);

    if (!building) {
      return;
    }

    const tile = building.getTile();
    
    if (tile) {
      tile.setBuilding(null);
    }

    ArrayUtils.removeFirst(this.buildings, building);

    const view = building.getView();

    if (view) {
      this.emit(GridEventType.RemoveBuildingView, view);
    }
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

  private listenTile(tile: Tile): void {
    tile.on(TileEventType.AddTileView, this.addTileView, this);
    tile.on(TileEventType.RemoveTileView, this.removeTileView, this);
  }

  private stopListeningTile(tile: Tile): void {
    tile.off(TileEventType.AddTileView, this.addTileView, this);
    tile.off(TileEventType.RemoveTileView, this.removeTileView, this);
  }

  private addTileView(view: TileView): void {
    this.emit(GridEventType.AddTileView, view);
  }

  private removeTileView(view: TileView): void {
    this.emit(GridEventType.RemoveTileView, view);
  }
}
