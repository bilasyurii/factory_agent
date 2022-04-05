import Building from '../building/building';
import TileEventType from './tile-event-type.enum';
import TileType from './tile-type.enum';
import TileView from './tile-view';

export default class Tile extends Phaser.Events.EventEmitter {
  protected x: number = 0;
  protected y: number = 0;
  protected view: TileView = null;
  protected building: Building = null;
  protected type: TileType = TileType.Grass;

  public getType(): TileType {
    return this.type;
  }

  public setType(type: TileType): void {
    this.type = type;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;

    const view = this.view;

    if (view) {
      view.updatePosition();
    }
  }

  public setView(view: TileView): void {
    const prevView = this.view;

    if (prevView !== view) {
      if (prevView) {
        this.view = null;
        prevView.setTile(null);
        this.emit(TileEventType.RemoveTileView, prevView);
      }
  
      this.view = view;

      if (view) {
        view.setTile(this);
        view.updatePosition();
        this.emit(TileEventType.AddTileView, view);
      }
    }
  }

  public getView(): TileView {
    return this.view;
  }

  public setBuilding(building: Building): void {
    const prevBuilding = this.building;

    if (prevBuilding !== building) {
      if (prevBuilding) {
        this.building = null;
        prevBuilding.setTile(null);
      }

      this.building = building;

      if (building) {
        building.setTile(this);
      }
    }
  }

  public getBuilding(): Building {
    return this.building;
  }
}
