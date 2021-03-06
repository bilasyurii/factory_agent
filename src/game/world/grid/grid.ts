import ArrayUtils from '../../../utils/array-utils';
import Building from '../building/building';
import BuildingType from '../building/building-type.enum';
import Tile from '../tiles/tile';
import TileEventType from '../tiles/tile-event-type.enum';
import TileView from '../tiles/tile-view';
import GridEventType from './grid-event-type.enum';

export default class Grid extends Phaser.Events.EventEmitter {
  public readonly scene: Scene;
  private tiles: Tile[][];
  private buildings: Building[];
  private width: number;
  private height: number;

  constructor(scene: Scene) {
    super();

    this.scene = scene;
  }

  public reset(): void {
    this.width = 0;
    this.height = 0;
    this.tiles = null;
    this.buildings = [];
    this.removeAllListeners();
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.initArray();
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getTile(x: number, y: number): Tile {
    const row = this.tiles[y];
    return row ? row[x] || null : null;
  }

  public getBuilding(x: number, y: number): Building {
    const row = this.tiles[y];

    if (!row) {
      return null;
    }

    const tile = row[x];
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
      this.addTileView(view);
    }
  }

  public removeBuildingAt(x: number, y: number): boolean {
    const building = this.getBuilding(x, y);

    if (building) {
      this.removeBuilding(building);
      return true;
    } else {
      return false;
    }
  }
  
  public forEachBuilding(cb: (building: Building) => void, ctx?: any) {
    this.buildings.forEach(cb, ctx);
  }

  public getBuildingById(id: number): Building {
    return this.buildings.find(function (building) {
      return building.id === id;
    });
  }

  public getBuildingsByType(type: BuildingType): Building[] {
    return this.buildings.filter(function (building) {
      return building.getType() === type;
    });
  }

  private initArray(): void {
    this.tiles = ArrayUtils.initArray<Tile>(this.width, this.height, null);
  }

  protected removeTileAt(x: number, y: number): void {
    const tiles = this.tiles;
    const tile = tiles[y][x];

    if (!tile) {
      return;
    }

    tiles[y][x] = null;

    this.stopListeningTile(tile);

    const view = tile.getView();

    if (view) {
      this.removeTileView(view);
    }
  }

  protected addBuilding(building: Building): void {
    const buildings = this.buildings;

    if (buildings.indexOf(building) !== -1) {
      return;
    }

    buildings.push(building);

    const tile = this.tiles[building.getY()][building.getX()];

    if (tile) {
      tile.setBuilding(building);
    }

    const view = building.getView();

    if (view) {
      this.emit(GridEventType.AddBuildingView, view);
    }
  }

  private listenTile(tile: Tile): void {
    tile.on(TileEventType.AddTileView, this.addTileView, this);
    tile.on(TileEventType.RemoveTileView, this.removeTileView, this);
    tile.on(TileEventType.AddBuilding, this.addBuilding, this);
    tile.on(TileEventType.RemoveBuilding, this.removeBuilding, this);
  }

  private stopListeningTile(tile: Tile): void {
    tile.off(TileEventType.AddTileView, this.addTileView, this);
    tile.off(TileEventType.RemoveTileView, this.removeTileView, this);
    tile.off(TileEventType.AddBuilding, this.addBuilding, this);
    tile.off(TileEventType.RemoveBuilding, this.removeBuilding, this);
  }

  private addTileView(view: TileView): void {
    this.emit(GridEventType.AddTileView, view);
  }

  private removeTileView(view: TileView): void {
    this.emit(GridEventType.RemoveTileView, view);
  }

  private removeBuilding(building: Building): void {
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
}
