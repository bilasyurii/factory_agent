import Building from '../building/building';
import TileView from './tile-view';

export default class Tile {
  protected x: number = 0;
  protected y: number = 0;
  protected view: TileView = null;
  protected building: Building = null;

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.view.updatePosition();
  }

  public setView(view: TileView): void {
    const prevView = this.view;

    if (prevView !== view) {
      if (prevView) {
        this.view = null;
        prevView.setTile(null);
      }
  
      this.view = view;
      view.setTile(this);
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
      building.setTile(this);
    }
  }

  public getBuilding(): Building {
    return this.building;
  }
}
